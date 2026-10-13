const { app, BrowserWindow, ipcMain, shell, dialog, clipboard } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const osExec = require('node:child_process');
const { spawn } = require('node:child_process');
const { promisify } = require('node:util');
const execFile = promisify(osExec.execFile);
const { pathToFileURL } = require('node:url');
const os = require('node:os');
const archiveSessions = new Map();
const metadataFile = () => path.join(app.getPath('userData'), 'file-metadata.json');
async function readMetadata(){try{return JSON.parse(await fs.readFile(metadataFile(),'utf8'));}catch{return {items:{}};}}
async function writeMetadata(data){await fs.mkdir(path.dirname(metadataFile()),{recursive:true});await fs.writeFile(metadataFile(),JSON.stringify(data,null,2),'utf8');}

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 620,
    backgroundColor: '#101114',
    title: 'Bento Explorer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(() => {
  ipcMain.handle('home', () => os.homedir());
  ipcMain.handle('window-minimize', () => mainWindow?.minimize());
  ipcMain.handle('window-close', () => mainWindow?.close());
  ipcMain.handle('drives', async () => {
    if (process.platform !== 'win32') return [{ name: '/', path: '/', type: 'drive' }];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const found = [];
    for (const letter of letters) {
      const root = letter + ':\\';
      try { await fs.access(root); found.push({ name: root, path: root, type: 'drive' }); } catch {}
    }
    return found;
  });
  ipcMain.handle('special-folders', () => {
    const home = os.homedir();
    return [
      { name: 'Desktop', path: path.join(home, 'Desktop'), icon: 'desktop' },
      { name: 'Downloads', path: path.join(home, 'Downloads'), icon: 'download' },
      { name: 'Documents', path: path.join(home, 'Documents'), icon: 'file-text' },
      { name: 'Pictures', path: path.join(home, 'Pictures'), icon: 'image' },
      { name: 'Music', path: path.join(home, 'Music'), icon: 'music' },
      { name: 'Videos', path: path.join(home, 'Videos'), icon: 'film' }
    ];
  });
  ipcMain.handle('get-tags', async () => { const data=await readMetadata(); const counts={}; for(const tag of data.definitions||[]) counts[tag]=0; for(const tags of Object.values(data.items||{})) for(const tag of tags) counts[tag]=(counts[tag]||0)+1; return Object.entries(counts).map(([name,count])=>({name,count})).sort((a,b)=>a.name.localeCompare(b.name)); });
  ipcMain.handle('create-tag', async (_e, name) => { const clean=String(name||'').trim().replace(/^#/,''); if(!clean||/[\\/]/.test(clean))throw new Error('Введите корректное название тега.');const data=await readMetadata();data.definitions=[...new Set([...(data.definitions||[]),clean])];await writeMetadata(data);return clean; });
  ipcMain.handle('set-tags', async (_e, target, tags) => {
    const data = await readMetadata();
    const normalized = path.resolve(String(target || ''));
    const clean = [...new Set((tags || []).map(t => String(t).trim().replace(/^#/, '')).filter(t => t && !/[\\/]/.test(t)))].slice(0, 20);
    if (clean.length) data.items[normalized] = clean; else delete data.items[normalized];
    data.definitions = [...new Set([...(data.definitions || []), ...clean])];
    await writeMetadata(data);
    return clean;
  });
  ipcMain.handle('list-tagged', async (_e, tag) => { const data=await readMetadata(); const result=[]; for(const [target,tags] of Object.entries(data.items||{})){if(!tags.includes(tag))continue;try{const stat=await fs.stat(target);const ext=path.extname(target).toLowerCase();const isDirectory=stat.isDirectory();let kind='file';if(isDirectory)kind='folder';else if(['.png','.jpg','.jpeg','.gif','.webp','.svg','.bmp','.ico'].includes(ext))kind='image';else if(['.mp4','.mov','.mkv','.webm','.avi'].includes(ext))kind='video';else if(['.mp3','.wav','.ogg','.flac','.m4a'].includes(ext))kind='audio';else if(['.zip','.7z','.rar','.tar','.gz'].includes(ext))kind='archive';else if(['.js','.ts','.tsx','.jsx','.html','.css','.json','.py','.gd','.cs','.cpp','.h','.md','.yml','.yaml','.toml','.sh','.ps1'].includes(ext))kind='code';result.push({name:path.basename(target),path:target,isDirectory,kind,extension:ext,size:stat.size,modified:stat.mtimeMs,hidden:path.basename(target).startsWith('.'),tags,isSymlink:false});}catch{delete data.items[target];}} await writeMetadata(data);return result.sort((a,b)=>Number(b.isDirectory)-Number(a.isDirectory)||a.name.localeCompare(b.name,undefined,{numeric:true})); });
  ipcMain.handle('list-directory', async (_e, requestedPath) => {
    const target = path.resolve(requestedPath || os.homedir());
    const lowerTarget = target.toLowerCase();
    for (const [rootKey, session] of archiveSessions.entries()) {
      const root = path.resolve(session.root);
      const relative = path.relative(root, target);
      if (lowerTarget === rootKey || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative))) {
        await extractArchiveLevel(session, relative === '.' ? '' : relative, _e.sender);
        break;
      }
    }
    const entries = await fs.readdir(target, { withFileTypes: true });
    const metadata = await readMetadata();
    const result = await Promise.all(entries.map(async entry => {
      const fullPath = path.join(target, entry.name);
      try {
        const stat = await fs.stat(fullPath);
        const ext = path.extname(entry.name).toLowerCase();
        const isDirectory = entry.isDirectory();
        let kind = 'file';
        if (isDirectory) kind = 'folder';
        else if (['.png','.jpg','.jpeg','.gif','.webp','.svg','.bmp','.ico'].includes(ext)) kind = 'image';
        else if (['.mp4','.mov','.mkv','.webm','.avi'].includes(ext)) kind = 'video';
        else if (['.mp3','.wav','.ogg','.flac','.m4a'].includes(ext)) kind = 'audio';
        else if (['.zip','.7z','.rar','.tar','.gz'].includes(ext)) kind = 'archive';
        else if (['.js','.ts','.tsx','.jsx','.html','.css','.json','.py','.gd','.cs','.cpp','.h','.md','.yml','.yaml','.toml','.sh','.ps1'].includes(ext)) kind = 'code';
        else if (['.exe','.msi','.bat','.cmd','.dll'].includes(ext)) kind = 'app';
        return { name: entry.name, path: fullPath, isDirectory, kind, extension: ext, size: stat.size, modified: stat.mtimeMs, hidden: entry.name.startsWith('.'), isSymlink: entry.isSymbolicLink(), tags: metadata.items?.[fullPath] || [] };
      } catch { return null; }
    }));
    return { path: target, parent: path.dirname(target) === target ? null : path.dirname(target), items: result.filter(Boolean) };
  });
  async function extractArchiveLevel(session, relativeDirectory, sender) {
    const normalizedDir = String(relativeDirectory || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const quotePs = value => String(value).replace(/'/g, "''");
    const script = [
      "Add-Type -AssemblyName System.IO.Compression.FileSystem",
      "$archivePath='" + quotePs(session.archivePath) + "'",
      "$destRoot=[IO.Path]::GetFullPath('" + quotePs(session.root) + "').TrimEnd([IO.Path]::DirectorySeparatorChar)+[IO.Path]::DirectorySeparatorChar",
      "$current='" + quotePs(normalizedDir) + "'",
      "$zip=[IO.Compression.ZipFile]::OpenRead($archivePath)",
      "try { $entries=$zip.Entries; $eligible=@(); foreach($entry in $entries) { $rel=$entry.FullName.Replace('\\','/').TrimStart('/'); if(!$rel -or $rel.Split('/') -contains '..') { continue }; if($current -ne '') { if(!$rel.StartsWith($current+'/',[StringComparison]::OrdinalIgnoreCase)) { continue }; $tail=$rel.Substring($current.Length+1) } else { $tail=$rel }; if(!$tail) { continue }; $parts=$tail.Split('/'); $outRel=if($current -eq '') {$parts[0]} else {$current+'/'+$parts[0]}; $out=[IO.Path]::GetFullPath([IO.Path]::Combine($destRoot,$outRel.Replace('/',[IO.Path]::DirectorySeparatorChar))); if(!$out.StartsWith($destRoot,[StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe archive path' }; if($parts.Length -gt 1 -or $entry.FullName.EndsWith('/')) { [IO.Directory]::CreateDirectory($out) | Out-Null } else { $eligible += [PSCustomObject]@{Entry=$entry;Out=$out} } }; $total=[Math]::Max(1,$eligible.Count); $i=0; foreach($item in $eligible) { if(!(Test-Path -LiteralPath $item.Out)) { [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($item.Out)) | Out-Null; [IO.Compression.ZipFileExtensions]::ExtractToFile($item.Entry,$item.Out,$true) }; $i++; Write-Output ('BENTO_PROGRESS:'+$i+':'+$total) } } finally { $zip.Dispose() }"
    ].join('; ');
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    if (sender && !sender.isDestroyed()) sender.send('archive-progress', { target: session.archivePath, progress: 0, phase: 'extracting' });
    await new Promise((resolve, reject) => {
      const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded], { windowsHide: true });
      let stderr = '', pending = '';
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', chunk => {
        pending += chunk;
        const lines = pending.split(/\r?\n/); pending = lines.pop() || '';
        for (const line of lines) {
          const match = line.match(/BENTO_PROGRESS:(\d+):(\d+)/);
          if (match && sender && !sender.isDestroyed()) sender.send('archive-progress', { target: session.archivePath, progress: Math.min(100, Math.round(Number(match[1]) / Number(match[2]) * 100)), phase: 'extracting' });
        }
      });
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', chunk => { stderr += chunk; });
      child.on('error', reject);
      child.on('close', code => code === 0 ? resolve() : reject(new Error((stderr || 'PowerShell exited with code ' + code).trim())));
    });
  }
  ipcMain.handle('open-archive', async (event, target) => {
    const resolved = path.resolve(String(target || ''));
    if (path.extname(resolved).toLowerCase() !== '.zip') throw new Error('Поддерживаются только ZIP-архивы.');
    const stat = await fs.stat(resolved);
    const crypto = require('node:crypto');
    const hash = crypto.createHash('sha1').update(resolved + stat.mtimeMs).digest('hex').slice(0, 16);
    const roots = [
      path.join(path.dirname(app.getPath('exe')), 'Bento-Explorer-Archives', hash),
      path.join(path.parse(app.getPath('exe')).root, 'Bento-Explorer-Archives', hash),
      path.join(app.getPath('temp'), 'Bento-Explorer-Archives', hash)
    ];
    let cacheRoot = roots[0], ready = false, lastError;
    for (const root of roots) {
      try { await fs.mkdir(root, { recursive: true }); cacheRoot = root; ready = true; break; }
      catch (error) { lastError = error; }
    }
    if (!ready) throw new Error('Не удалось создать папку для архива: ' + lastError.message);
    await fs.rm(cacheRoot, { recursive: true, force: true });
    await fs.mkdir(cacheRoot, { recursive: true });
    const session = { archivePath: resolved, root: cacheRoot, mtimeMs: stat.mtimeMs };
    archiveSessions.set(path.resolve(cacheRoot).toLowerCase(), session);
    try { await extractArchiveLevel(session, '', event.sender); }
    catch (error) { await fs.rm(cacheRoot, { recursive: true, force: true }); archiveSessions.delete(path.resolve(cacheRoot).toLowerCase()); throw new Error('Не удалось открыть ZIP: ' + error.message); }
    if (!event.sender.isDestroyed()) event.sender.send('archive-progress', { target: resolved, progress: 100, phase: 'done' });
    return cacheRoot;
  });
  ipcMain.handle('file-url', (_e, target) => pathToFileURL(path.resolve(String(target))).href);
  ipcMain.handle('open-path', async (_e, target) => {
    const result = await shell.openPath(target);
    if (result) throw new Error(result);
    return true;
  });
  ipcMain.handle('reveal-path', (_e, target) => shell.showItemInFolder(target));
  ipcMain.handle('choose-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    return result.canceled ? null : result.filePaths[0];
  });
  ipcMain.handle('create-folder', async (_e, parent, name) => {
    const clean = String(name || '').trim();
    if (!clean || clean.includes('\\') || clean.includes('/') || clean === '.' || clean === '..') throw new Error('Enter a valid folder name.');
    const target = path.join(parent, clean);
    await fs.mkdir(target);
    return target;
  });
  ipcMain.handle('rename', async (_e, target, name) => {
    const clean = String(name || '').trim();
    if (!clean || clean.includes('\\') || clean.includes('/') || clean === '.' || clean === '..') throw new Error('Enter a valid name.');
    const next = path.join(path.dirname(target), clean);
    await fs.rename(target, next);
    const data=await readMetadata();const prefix=target.endsWith(path.sep)?target:target+path.sep;for(const [key,tags] of Object.entries(data.items||{})){if(key===target||key.startsWith(prefix)){const mapped=next+key.slice(target.length);data.items[mapped]=tags;delete data.items[key];}}await writeMetadata(data);
    return next;
  });
  ipcMain.handle('trash', async (_e, target) => {
    try { await fs.access(target); } catch { throw new Error('File is missing or inaccessible: '+target); }
    try { await shell.trashItem(target); } catch (e) { throw new Error('Could not move to Recycle Bin: '+e.message); }
    return true;
  });
  ipcMain.handle('copy-paths', (_e, targets) => {
    clipboard.writeText((targets || []).join('\n'));
    return true;
  });
  ipcMain.handle('paste-items', async (_e, targets, destination, move) => {
    const results = [];
    for (const source of targets || []) {
      const dest = path.join(destination, path.basename(source));
      if (path.resolve(source) === path.resolve(dest)) continue;
      try {
        await fs.access(dest);
        results.push({ source, status: 'exists', destination: dest });
        continue;
      } catch {}
      try {
        if (move) {
          try { await fs.rename(source, dest); }
          catch (error) {
            if (!['EXDEV','EPERM','EACCES'].includes(error.code)) throw error;
            await fs.cp(source, dest, { recursive: true, errorOnExist: true, force: false });
            await fs.rm(source, { recursive: true, force: false });
          }
        } else await fs.cp(source, dest, { recursive: true, errorOnExist: true, force: false });
        const meta=await readMetadata();const prefix=source.endsWith(path.sep)?source:source+path.sep;for(const [key,tags] of Object.entries(meta.items||{})){if(key===source||key.startsWith(prefix)){const mapped=dest+key.slice(source.length);if(move)delete meta.items[key];meta.items[mapped]=tags;}}await writeMetadata(meta);
        results.push({ source, status: 'ok', destination: dest });
      } catch (error) { results.push({ source, status: 'error', message: error.message }); }
    }
    return results;
  });
  ipcMain.handle('properties', async (_e, target) => {
    const stat = await fs.stat(target);
    return { path: target, size: stat.size, modified: stat.mtime.toISOString(), created: stat.birthtime.toISOString(), directory: stat.isDirectory() };
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

