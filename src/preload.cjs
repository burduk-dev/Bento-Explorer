const { contextBridge, ipcRenderer, webUtils } = require('electron');
contextBridge.exposeInMainWorld('bento', {
  home: () => ipcRenderer.invoke('home'),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),
  drives: () => ipcRenderer.invoke('drives'),
  specialFolders: () => ipcRenderer.invoke('special-folders'),
  listDirectory: p => ipcRenderer.invoke('list-directory', p),
  openPath: p => ipcRenderer.invoke('open-path', p),
  revealPath: p => ipcRenderer.invoke('reveal-path', p),
  chooseFolder: () => ipcRenderer.invoke('choose-folder'),
  createFolder: (p, n) => ipcRenderer.invoke('create-folder', p, n),
  rename: (p, n) => ipcRenderer.invoke('rename', p, n),
  trash: p => ipcRenderer.invoke('trash', p),
  copyPaths: p => ipcRenderer.invoke('copy-paths', p),
  pasteItems: (p, d, m) => ipcRenderer.invoke('paste-items', p, d, m),
  properties: p => ipcRenderer.invoke('properties', p),
  getTags: () => ipcRenderer.invoke('get-tags'),
  createTag: name => ipcRenderer.invoke('create-tag', name),
  setTags: (p, tags) => ipcRenderer.invoke('set-tags', p, tags),
  listTagged: tag => ipcRenderer.invoke('list-tagged', tag),
  getDroppedPath: file => webUtils.getPathForFile(file)
});