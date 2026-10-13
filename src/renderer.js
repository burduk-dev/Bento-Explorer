const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const iconPaths = {
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 'folder-plus':'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10v6m-3-3h6"/>',
 'folder-open':'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1"/><path d="M3 12h18l-2 7H5z"/>',
 file:'<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"/><path d="M13 3v7h7"/>',
 'file-text':'<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"/><path d="M13 3v7h7M8 14h8m-8 4h8"/>',
 monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 video:'<rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-3v10l-4-3z"/>',
 audio:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
 archive:'<path d="M4 4h16v5H4zM5 9v11h14V9M10 13h4"/>',
 code:'<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/>',
 app:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m10 8 6 4-6 4z"/>',
 desktop:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3"/>',
 music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
 film:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4m-4 8h4m10-8h4m-4 8h4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 'arrow-left':'<path d="m15 18-6-6 6-6M9 12h12"/>',
 'arrow-right':'<path d="m9 18 6-6-6-6M3 12h12"/>',
 'arrow-up':'<path d="m18 15-6-6-6 6M12 9v12"/>',
 'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
 'arrow-down-wide-narrow':'<path d="m3 6 4 4 4-4M7 10V3M14 6h7M14 12h5m-5 6h3"/>',
 'layout-grid':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
 list:'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.5-2L20 12M4 12l2.9 5a7 7 0 0 0 11.5-2"/>',
 'refresh-cw':'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.5-2L20 12M4 12l2.9 5a7 7 0 0 0 11.5-2"/>',
 'sun-moon':'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
 'settings-2':'<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 8h4"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.1 8.1 12.8 12.8M14.8 9.2 20 4M8.1 15.9l3.2-3.2"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
 trash:'<path d="M3 6h18m-2 0-1 14H6L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9h.01"/>',
 external:'<path d="M14 3h7v7m0-7L10 14"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 x:'<path d="m18 6-12 12M6 6l12 12"/>',
 columns:'<rect x="3" y="4" width="8" height="16" rx="2"/><rect x="13" y="4" width="8" height="16" rx="2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
};
function icon(name, cls='') { return '<svg class="icon '+cls+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(iconPaths[name]||iconPaths.file)+'</svg>'; }
$$('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const state = { path:'', parent:null, items:[], view:localStorage.getItem('bento-view')||'grid', sort:'name', reverse:false, query:'', selected:new Set(), history:[], future:[], mode:'home', favorites:JSON.parse(localStorage.getItem('bento-favorites')||'[]'), special:[], drives:[], clipboard:[], clipboardMove:false, recent:JSON.parse(localStorage.getItem('bento-recent')||'[]'), contextItem:null, lastClick:null, tabs:JSON.parse(localStorage.getItem('bento-tabs')||'[]'), activeTabId:0, nextTabId:1, currentTag:'', tags:[], split:false, rightPath:'', rightItems:[], rightSelected:new Set(), rightParent:null, gesture:null, rightDown:false, leftDown:false, lastRock:0, draggedPaths:[] };
const homeCache = new Map();
const formatSize = n => n < 1024 ? n+' Б' : n < 1048576 ? (n/1024).toFixed(1)+' КБ' : n < 1073741824 ? (n/1048576).toFixed(1)+' МБ' : (n/1073741824).toFixed(2)+' ГБ';
const formatDate = ms => new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',year:'numeric'}).format(new Date(ms));
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const extOf = name => (name.split('.').pop()||'').toUpperCase();
function toast(message, bad=false){const el=$('#toast');el.textContent=message;el.classList.toggle('bad',bad);el.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.add('hidden'),2600);}
function iconFor(item){return item.isDirectory?'folder':({image:'image',video:'video',audio:'audio',archive:'archive',code:'code',app:'app'}[item.kind]||'file');}
function colorFor(item){if(item.isDirectory)return 'folder-color';return ({image:'image-color',video:'video-color',audio:'audio-color',archive:'archive-color',code:'code-color',app:'app-color'}[item.kind]||'file-color');}
async function init(){
  state.path=await window.bento.home();
  state.special=await window.bento.specialFolders();
  state.drives=await window.bento.drives();
  renderSidebar();
  await navigate(state.path,{replace:true,mode:'home'});
}
function renderSidebar(){
  $('#library').innerHTML=state.special.map(s=>'<button class="nav-item compact" data-path="'+esc(s.path)+'">'+icon(s.icon,'nav-icon')+'<span>'+esc(s.name)+'</span></button>').join('');
  $('#drives').innerHTML=state.drives.map(d=>'<button class="nav-item compact" data-path="'+esc(d.path)+'">'+icon('desktop','nav-icon')+'<span>'+esc(d.name)+'</span></button>').join('');
  localStorage.setItem('bento-favorites',JSON.stringify(state.favorites));$('#favorites').innerHTML=state.favorites.length?state.favorites.map((f,i)=>'<button class="nav-item compact favorite-item" data-path="'+esc(f.path)+'">'+icon('folder','nav-icon')+'<span>'+esc(f.name)+'</span><span class="favorite-remove" data-remove-fav="'+i+'" title="Убрать">×</span></button>').join(''):'<div class="empty-favorites">Закрепляйте нужные папки</div>';
}
async function navigate(target,opts={}){
  const clean=String(target||state.path);
  try{
    let result; if(clean.startsWith('tag://')){state.currentTag=decodeURIComponent(clean.slice(6));result={path:clean,parent:null,items:await window.bento.listTagged(state.currentTag)};opts.mode='tag';}else{result=await window.bento.listDirectory(clean);state.currentTag='';}
    if(!opts.replace && state.path && result.path!==state.path) state.history.push(state.path);
    if(!opts.fromHistory) state.future=[];
    state.path=result.path;state.parent=result.parent;state.items=result.items;state.selected.clear();state.query='';$('#search').value='';
    state.mode=opts.mode||'folder';
    if(opts.mode==='home') { $('#page-title').textContent='Главная';$('#page-subtitle').textContent='Всё важное — рядом. Без лишнего шума.';$('#eyebrow').textContent='ВАШЕ ПРОСТРАНСТВО';$('#quick-cards').classList.remove('hidden');$('#items-title').textContent='Содержимое папки'; }
    else if(opts.mode==='tag'){ $('#page-title').textContent='# '+state.currentTag;$('#page-subtitle').textContent='Виртуальная папка: все элементы с этим тегом.';$('#eyebrow').textContent='УМНЫЕ ПАПКИ';$('#quick-cards').classList.add('hidden');$('#items-title').textContent='Элементы с тегом'; }
    else if(opts.mode==='recent'){ $('#page-title').textContent='Недавние';$('#page-subtitle').textContent='Файлы, с которыми вы работали.';$('#eyebrow').textContent='ИСТОРИЯ';$('#quick-cards').classList.add('hidden'); }
    else { $('#page-title').textContent=basename(result.path)||result.path;$('#page-subtitle').textContent=result.path;$('#eyebrow').textContent='ПАПКА';$('#quick-cards').classList.add('hidden');$('#items-title').textContent='Файлы и папки'; }
    $('#address').value=opts.mode==='tag'?'#'+state.currentTag:result.path;
    if(state.tabs?.length){const t=state.tabs.find(t=>t.id===state.activeTabId);if(t){t.path=result.path;t.mode=state.mode;t.label=state.mode==='tag'?'# '+state.currentTag:(state.mode==='home'?'Главная':basename(result.path));}persistTabs();renderTabs();}
    renderBreadcrumbs();renderFiles();renderStatus();if(state.split)await loadRightPane();
  }catch(e){toast('Не удалось открыть папку: '+e.message,true);}
}
function basename(p){return p.replace(/[\\/]+$/,'').split(/[\\/]/).pop()||p;}
function renderBreadcrumbs(){
 if(state.mode==='tag'){$('#breadcrumbs').innerHTML='<button class="current" data-tag-breadcrumb="1">Теги</button><span class="crumb-sep">/</span><button class="current">#'+esc(state.currentTag)+'</button>';return;}
 const sep=state.path.includes('\\')?'\\':'/';const bits=state.path.split(/[\\/]/).filter(Boolean);let built=state.path.startsWith('\\\\')?'\\\\':'';
 const parts=[];
 if(state.path.match(/^[A-Za-z]:/)) {built=bits[0]+'\\';parts.push({name:bits[0],path:built});bits.shift();}
 else if(state.path.startsWith('/')) parts.push({name:'/',path:'/'});
 bits.forEach((bit,i)=>{built= built ? (built.endsWith('\\')||built.endsWith('/')?built:built+sep)+bit : bit; if(i<bits.length-1)built+=sep;parts.push({name:bit,path:built});});
 $('#breadcrumbs').innerHTML=parts.map((p,i)=>'<button data-crumb="'+esc(p.path)+'" class="'+(i===parts.length-1?'current':'')+'">'+esc(p.name)+'</button>'+ (i<parts.length-1?'<span class="crumb-sep">/</span>':'')).join('');
}
function visibleItems(){
 const prefs=JSON.parse(localStorage.getItem('bento-preferences')||'{}');let items=state.items.filter(i=>!i.hidden || prefs.showHidden);
 if(state.query)items=items.filter(i=>i.name.toLowerCase().includes(state.query.toLowerCase())||(i.tags||[]).some(t=>t.toLowerCase().includes(state.query.toLowerCase())));
 items.sort((a,b)=>{if(a.isDirectory!==b.isDirectory)return a.isDirectory?-1:1;let v=0;if(state.sort==='modified')v=a.modified-b.modified;else if(state.sort==='size')v=a.size-b.size;else v=a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'});return state.reverse?-v:v;});
 return items;
}
function renderFiles(){
 const area=$('#file-area');area.className='file-area '+(state.view==='grid'?'grid-view':'list-view');
 $$('.view-toggle').forEach(b=>b.classList.toggle('selected',b.dataset.view===state.view));
 const items=visibleItems();$('#item-count').textContent=items.length+' '+(items.length===1?'элемент':items.length>1&&items.length<5?'элемента':'элементов');
 if(!items.length){area.innerHTML='<div class="empty-state"><div class="empty-art">'+icon(state.query?'search':'folder-open')+'</div><h3>'+(state.query?'Ничего не найдено':'Здесь пока пусто')+'</h3><p>'+(state.query?'Попробуйте изменить поисковый запрос.':'Создайте папку или перейдите в другое место.')+'</p>'+(state.query?'<button class="secondary-button" id="clear-search">Очистить поиск</button>':'<button class="primary-button" id="empty-new-folder">Создать папку</button>')+'</div>';$('#clear-search')?.addEventListener('click',()=>{$('#search').value='';state.query='';renderFiles();});$('#empty-new-folder')?.addEventListener('click',createFolderDialog);return;}
 if(state.view==='list'){
 area.innerHTML='<div class="list-header"><span>Имя</span><span>Изменён</span><span>Размер</span><span></span></div>'+items.map(item=>'<div class="file-row '+(state.selected.has(item.path)?'is-selected':'')+'" data-item="'+esc(item.path)+'" draggable="true" tabindex="0"><div class="row-name"><span class="file-type '+colorFor(item)+'">'+icon(iconFor(item))+'</span><span class="file-name">'+esc(item.name)+'</span></div><span class="file-date">'+formatDate(item.modified)+'</span><span class="file-size">'+(item.isDirectory?'—':formatSize(item.size))+'</span><button class="icon-button row-more" data-more="'+esc(item.path)+'" title="Действия">'+icon('more')+'</button></div>').join('');
 }else{
 area.innerHTML=items.map(item=>'<article class="file-card '+(state.selected.has(item.path)?'is-selected':'')+'" data-item="'+esc(item.path)+'" draggable="true" tabindex="0"><div class="card-top"><span class="file-type '+colorFor(item)+'">'+icon(iconFor(item))+'</span><button class="icon-button card-more" data-more="'+esc(item.path)+'" title="Действия">'+icon('more')+'</button></div><div class="file-name" title="'+esc(item.name)+'">'+esc(item.name)+'</div><div class="file-meta"><span>'+(item.isDirectory?'Папка':(item.extension||'Файл').replace('.','').toUpperCase())+'</span><span>'+(item.isDirectory?'':formatSize(item.size))+'</span></div><div class="card-footer"><span>'+formatDate(item.modified)+'</span><span class="mini-dot"></span></div>'+(item.tags&&item.tags.length?'<div class="tag-chips">'+item.tags.map(t=>'<span class="tag-chip">#'+esc(t)+'</span>').join('')+'</div>':'')+'</article>').join('');
 }
 area.querySelectorAll('[data-item]').forEach(el=>{const item=state.items.find(i=>i.path===el.dataset.item);if(!item?.isDirectory)return;const host=el.querySelector('.card-top')||el;const actions=document.createElement('div');actions.className='item-quick-actions';actions.innerHTML='<button type="button" class="icon-button" data-item-action="open" title="Открыть сейчас">'+icon('external')+'</button><button type="button" class="icon-button" data-item-action="tab" title="Открыть в новой вкладке">'+icon('plus')+'</button>';host.appendChild(actions);});
 const selected=items.filter(item=>state.selected.has(item.path));
 const prefs=JSON.parse(localStorage.getItem('bento-preferences')||'{}');const image=selected.length===1&&selected[0].kind==='image'?selected[0]:null;const preview=$('#image-preview');$('#preview-toggle')?.classList.toggle('selected',prefs.imagePreview!==false);$('#preview-toggle')?.setAttribute('aria-pressed',String(prefs.imagePreview!==false));if(preview){preview.classList.toggle('hidden',!image||prefs.imagePreview===false);preview.innerHTML=image?'<div class="preview-heading"><span>Предпросмотр</span><button type="button" class="icon-button small" id="preview-open" title="Открыть изображение">'+icon('external')+'</button></div><img id="preview-image" alt="'+esc(image.name)+'"><div class="preview-name">'+esc(image.name)+'</div><div class="preview-meta">'+formatSize(image.size)+'</div>':'';if(image){window.bento.fileUrl(image.path).then(url=>{const img=$('#preview-image');if(img)img.src=url;}).catch(e=>toast(e.message,true));$('#preview-open')?.addEventListener('click',()=>openItem(image));}}
 $('#statusbar').classList.toggle('has-selection',selected.length>0);
 if(selected.length===1){const item=selected[0];const kind=item.isDirectory?'\u041f\u0430\u043f\u043a\u0430':(item.extension||'\u0424\u0430\u0439\u043b').replace('.','').toUpperCase();$('#status-text').textContent=item.name+' · '+kind+' · '+(item.isDirectory?'\u043f\u0430\u043f\u043a\u0430':formatSize(item.size))+' · '+formatDate(item.modified);$('#status-path').textContent=item.path;}
 else if(selected.length>1){const files=selected.filter(item=>!item.isDirectory);const folders=selected.length-files.length;const total=files.reduce((sum,item)=>sum+(Number(item.size)||0),0);$('#status-text').textContent='\u0412\u044b\u0431\u0440\u0430\u043d\u043e: '+selected.length+' · '+files.length+' \u0444\u0430\u0439\u043b\u043e\u0432 · '+folders+' \u043f\u0430\u043f\u043e\u043a · '+formatSize(total);$('#status-path').textContent=selected.slice(0,3).map(item=>item.name).join(', ')+(selected.length>3?' +'+(selected.length-3):'');}
 else{$('#status-text').textContent=items.length+' \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432';$('#status-path').textContent=state.path;}
}
function renderStatus(){renderFiles();}
function renderBreadcrumbClick(path){navigate(path);}
function selectItem(path,add=false){if(!add)state.selected.clear();if(state.selected.has(path)&&add)state.selected.delete(path);else state.selected.add(path);renderFiles();}
function selectedItems(){return state.selected.size?[...state.selected]:[];}
async function openItem(item){if(!item.isDirectory&&item.extension==='.zip'){const tab=state.tabs?.find(t=>t.id===state.activeTabId);if(tab){tab.loading=true;tab.loadingTarget=item.path;tab.progress=0;renderTabs?.();}try{const extracted=await window.bento.openArchive(item.path);await navigate(extracted);toast('ZIP-архив открыт');}catch(e){toast(e.message,true);}finally{if(tab){tab.loading=false;tab.loadingTarget='';tab.progress=0;renderTabs?.();}}return;}if(item.isDirectory){state.recent.unshift(item.path);state.recent=[...new Set(state.recent)].slice(0,20);localStorage.setItem('bento-recent',JSON.stringify(state.recent));await navigate(item.path);}else{try{await window.bento.openPath(item.path);state.recent.unshift(item.path);state.recent=[...new Set(state.recent)].slice(0,20);localStorage.setItem('bento-recent',JSON.stringify(state.recent));}catch(e){toast(e.message,true);}}}
function showContext(item,x,y){
 state.contextItem=item;const menu=$('#context-menu');const isFolder=item.isDirectory;
 const actions=[['open','Открыть','external'],['tag','Изменить теги','tag'],['rename','Переименовать','edit'],['copy','Копировать','copy'],['cut','Вырезать','scissors'],['reveal','Показать в папке','folder'],['properties','Свойства','info'],['trash','В корзину','trash']];
 menu.innerHTML=actions.map(([id,label,ic],i)=>'<button role="menuitem" data-action="'+id+'" class="'+(id==='trash'?'danger':'')+'">'+icon(ic)+'<span>'+label+'</span>'+(id==='rename'?'<kbd>F2</kbd>':id==='copy'?'<kbd>Ctrl C</kbd>':id==='trash'?'<kbd>Del</kbd>':'')+'</button>'+(i===0||i===3?'<div class="menu-divider"></div>':'')).join('');
 menu.classList.remove('hidden');const r=menu.getBoundingClientRect();menu.style.left=Math.min(x,innerWidth-r.width-12)+'px';menu.style.top=Math.min(y,innerHeight-r.height-12)+'px';
}
function hideContext(){$('#context-menu').classList.add('hidden');}
async function handleAction(action,item=state.contextItem){
 if(!item)return;hideContext();
 try{
 if(action==='open')return openItem(item);
 if(action==='tag'){const current=(item.tags||[]).join(', ');const value=await editTagsDialog(current);if(value===null)return;const tags=value.split(',').map(t=>t.trim().replace(/^#/,'')).filter(Boolean);await window.bento.setTags(item.path,tags);toast(tags.length?'Теги сохранены':'Теги удалены');await refreshTagList();if(state.mode==='tag')return navigate('tag://'+encodeURIComponent(state.currentTag),{replace:true,mode:'tag'});return navigate(state.path,{replace:true,mode:state.mode});}
 if(action==='reveal')return window.bento.revealPath(item.path);
 if(action==='copy'||action==='cut'){state.clipboard=[item.path];state.clipboardMove=action==='cut';toast(action==='copy'?'Скопировано':'Готово к перемещению');return;}
 if(action==='rename'){const name=await askName('Переименовать','Введите новое имя',item.name,'Сохранить');if(name===null)return;await window.bento.rename(item.path,name);toast('Переименовано');return navigate(state.path,{replace:true,mode:state.mode});}
 if(action==='trash'){const targets=state.selected.has(item.path)?selectedItems():[item.path];const prefs=JSON.parse(localStorage.getItem('bento-preferences')||'{}');if(prefs.confirmDelete!==false&&!confirm('Move '+targets.length+' item(s) to Recycle Bin?'))return;const outcomes=await Promise.allSettled(targets.map(p=>window.bento.trash(p)));const failed=outcomes.filter(x=>x.status==='rejected');state.selected.clear();toast(failed.length?'Moved '+(outcomes.length-failed.length)+', failed '+failed.length+(failed[0]?' — '+failed[0].reason.message:''):'Moved to Recycle Bin: '+outcomes.length,failed.length>0);return navigate(state.path,{replace:true,mode:state.mode});}
 if(action==='properties'){const p=await window.bento.properties(item.path);$('#properties-content').innerHTML='<div class="property-row"><span>Имя</span><strong>'+esc(item.name)+'</strong></div><div class="property-row"><span>Тип</span><strong>'+(p.directory?'Папка':esc(item.extension||'Файл'))+'</strong></div><div class="property-row"><span>Размер</span><strong>'+(p.directory?'—':formatSize(p.size))+'</strong></div><div class="property-row"><span>Изменён</span><strong>'+esc(new Date(p.modified).toLocaleString('ru-RU'))+'</strong></div><div class="property-path">'+esc(p.path)+'</div>';$('#properties-dialog').showModal();}
 }catch(e){toast(e.message,true);}
}
function askName(title,copy,value='',confirmLabel='Создать'){
 return new Promise(resolve=>{const d=$('#name-dialog');$('#dialog-title').textContent=title;$('#dialog-copy').textContent=copy;$('#name-input').value=value;$('#confirm-dialog').textContent=confirmLabel;d.showModal();setTimeout(()=>{$('#name-input').focus();$('#name-input').select();},30);
 const done=v=>{d.close();$('#name-form').removeEventListener('submit',submit);$('#cancel-dialog').removeEventListener('click',cancel);resolve(v);};
 const submit=e=>{e.preventDefault();const v=$('#name-input').value.trim();if(v)done(v);};const cancel=()=>done(null);
 $('#name-form').addEventListener('submit',submit);$('#cancel-dialog').addEventListener('click',cancel,{once:true});
 d.addEventListener('cancel',()=>resolve(null),{once:true});
 });
}

function editTagsDialog(value=''){
 return new Promise(resolve=>{
  const d=$('#name-dialog'), input=$('#name-input'), form=$('#name-form');
  $('#dialog-title').textContent='Изменить теги';
  $('#dialog-copy').textContent='Введите теги через запятую. Оставьте поле пустым, чтобы удалить все теги.';
  $('#confirm-dialog').textContent='Сохранить'; input.required=false; input.placeholder='например: работа, важно, идеи'; input.value=value;
  d.showModal(); setTimeout(()=>{input.focus();input.select();},30);
  let settled=false;
  const done=v=>{if(settled)return;settled=true;d.close();form.removeEventListener('submit',submit);$('#cancel-dialog').removeEventListener('click',cancel);d.removeEventListener('cancel',onCancel);input.required=true;input.placeholder='';$('#dialog-title').textContent='Новая папка';$('#dialog-copy').textContent='Придумайте короткое и понятное название.';$('#confirm-dialog').textContent='Создать';resolve(v);};
  const submit=e=>{e.preventDefault();done(input.value);};
  const cancel=()=>done(null), onCancel=()=>done(null);
  form.addEventListener('submit',submit);$('#cancel-dialog').addEventListener('click',cancel);d.addEventListener('cancel',onCancel);
 });
}

async function createFolderDialog(){const name=await askName('Новая папка','Придумайте короткое и понятное название.','','Создать');if(!name)return;try{await window.bento.createFolder(state.path,name);toast('Папка создана');await navigate(state.path,{replace:true,mode:state.mode});}catch(e){toast(e.message,true);}}
function sortNext(){const options=['name','modified','size'];state.sort=options[(options.indexOf(state.sort)+1)%options.length];state.reverse=false;toast('Сортировка: '+({name:'по имени',modified:'по дате изменения',size:'по размеру'}[state.sort]));renderFiles();}
$('#back').addEventListener('click',()=>{const p=state.history.pop();if(p){state.future.push(state.path);navigate(p,{replace:true,fromHistory:true});}});
$('#forward').addEventListener('click',()=>{const p=state.future.pop();if(p){state.history.push(state.path);navigate(p,{replace:true,fromHistory:true});}});
$('#up').addEventListener('click',()=>state.parent&&navigate(state.parent));
$('#go-address').addEventListener('click',()=>navigate($('#address').value.trim()));
$('#address').addEventListener('keydown',e=>{if(e.key==='Enter')navigate($('#address').value.trim());if(e.key==='Escape')$('#address').value=state.path;});
$('#search').addEventListener('input',e=>{state.query=e.target.value;renderFiles();});
$$('.view-toggle').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;localStorage.setItem('bento-view',state.view);renderFiles();}));
$('#sort-button').addEventListener('click',sortNext);
$('#preview-toggle')?.addEventListener('click',()=>{const p=JSON.parse(localStorage.getItem('bento-preferences')||'{}');p.imagePreview=p.imagePreview===false;localStorage.setItem('bento-preferences',JSON.stringify(p));renderFiles();});
$('#new-folder').addEventListener('click',createFolderDialog);
$('#refresh-drives').addEventListener('click',async()=>{state.drives=await window.bento.drives();renderSidebar();toast('Диски обновлены');});
$('#add-favorite').addEventListener('click',()=>{if(state.favorites.some(f=>f.path===state.path)){toast('Эта папка уже в избранном');return;}state.favorites.push({name:basename(state.path)||state.path,path:state.path});renderSidebar();toast('Добавлено в избранное');});
$('#toggle-theme').addEventListener('click',()=>{document.body.classList.toggle('light-theme');localStorage.setItem('bento-theme',document.body.classList.contains('light-theme')?'light':'dark');});
$('#settings-button').addEventListener('click',openSettings);
function applyPreferences(){const p=JSON.parse(localStorage.getItem('bento-preferences')||'{}');document.body.classList.toggle('sidebar-collapsed',!!p.hideSidebar);}
function openSettings(){const p=JSON.parse(localStorage.getItem('bento-preferences')||'{}');$('#pref-hide-sidebar').checked=!!p.hideSidebar;$('#pref-show-hidden').checked=!!p.showHidden;$('#pref-image-preview').checked=p.imagePreview!==false;$('#pref-confirm-delete').checked=p.confirmDelete!==false;$('#settings-dialog').showModal();}
function savePreferences(){const p={hideSidebar:$('#pref-hide-sidebar').checked,showHidden:$('#pref-show-hidden').checked,imagePreview:$('#pref-image-preview').checked,confirmDelete:$('#pref-confirm-delete').checked};localStorage.setItem('bento-preferences',JSON.stringify(p));applyPreferences();$('#settings-dialog').close();renderFiles();}
$('#minimize').addEventListener('click',()=>window.bento.minimize());
$('#close-window').addEventListener('click',()=>window.bento.close());
$$('[data-special]').forEach(b=>b.addEventListener('click',()=>{const item=state.special.find(s=>s.name===b.dataset.special);if(item)navigate(item.path);}));
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.route==='home')navigate(state.path,{replace:true,mode:'home'});else{const recent=state.recent.map(p=>({name:basename(p),path:p,isDirectory:false,kind:'file',size:0,modified:Date.now()}));state.items=recent;state.mode='recent';$('#page-title').textContent='Недавние';$('#page-subtitle').textContent='Файлы, с которыми вы работали.';$('#eyebrow').textContent='ИСТОРИЯ';$('#quick-cards').classList.add('hidden');$('#address').value='Недавние';$('#breadcrumbs').innerHTML='';renderFiles();}}));
document.addEventListener('click',e=>{
 const remove=e.target.closest('[data-remove-fav]');if(remove){state.favorites.splice(Number(remove.dataset.removeFav),1);renderSidebar();return;}
 const crumb=e.target.closest('[data-crumb]');if(crumb){navigate(crumb.dataset.crumb);return;}
 const nav=e.target.closest('.nav-item[data-path]');if(nav){navigate(nav.dataset.path);return;}
 const more=e.target.closest('[data-more]');if(more){e.stopPropagation();const item=state.items.find(i=>i.path===more.dataset.more)||{path:more.dataset.more,name:basename(more.dataset.more),isDirectory:false,kind:'file',size:0,modified:Date.now()};showContext(item,more.getBoundingClientRect().left,more.getBoundingClientRect().bottom);return;}
 const action=e.target.closest('[data-action]');if(action){handleAction(action.dataset.action);return;}
 const quick=e.target.closest('[data-item-action]');if(quick){e.preventDefault();e.stopPropagation();const card=quick.closest('[data-item]');const item=card&&state.items.find(i=>i.path===card.dataset.item);if(item){if(quick.dataset.itemAction==='tab')createTab(item.path,'folder',true);else openItem(item);}return;}
 const card=e.target.closest('[data-item]');if(card){const item=state.items.find(i=>i.path===card.dataset.item)||{path:card.dataset.item,name:basename(card.dataset.item),isDirectory:false,kind:'file',size:0,modified:Date.now()};if(e.shiftKey){state.lastClick=null;openItem(item);return;}const now=Date.now();if(state.lastClick&&state.lastClick.path===item.path&&now-state.lastClick.time<420){state.lastClick=null;openItem(item);}else{state.lastClick={path:item.path,time:now};selectItem(item.path,e.ctrlKey||e.metaKey);}return;}
 if(!e.target.closest('#context-menu'))hideContext();
});

document.addEventListener('contextmenu',e=>{if(state.rockingHandled){e.preventDefault();state.rockingHandled=false;return;}const card=e.target.closest('[data-item]');if(card){e.preventDefault();const item=state.items.find(i=>i.path===card.dataset.item)||{path:card.dataset.item,name:basename(card.dataset.item),isDirectory:false,kind:'file',size:0,modified:Date.now()};if(!state.selected.has(item.path))selectItem(item.path);showContext(item,e.clientX,e.clientY);}});
document.addEventListener('keydown',async e=>{
 const mod=e.ctrlKey||e.metaKey;
 if(e.key==='Escape')hideContext();
 if(mod&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search').focus();$('#search').select();}
 if(mod&&e.key.toLowerCase()==='l'){e.preventDefault();$('#address').focus();$('#address').select();}
 if(mod&&e.key.toLowerCase()==='a'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();visibleItems().forEach(i=>state.selected.add(i.path));renderFiles();}
 if(mod&&e.key.toLowerCase()==='c'&&state.selected.size){state.clipboard=selectedItems();state.clipboardMove=false;toast('Скопировано: '+state.clipboard.length);}
 if(mod&&e.key.toLowerCase()==='x'&&state.selected.size){state.clipboard=selectedItems();state.clipboardMove=true;toast('Выбрано для перемещения: '+state.clipboard.length);}
 if(mod&&e.key.toLowerCase()==='v'&&state.clipboard.length){e.preventDefault();const res=await window.bento.pasteItems(state.clipboard,state.path,state.clipboardMove);const ok=res.filter(r=>r.status==='ok').length;toast('Готово: '+ok+' · пропущено: '+(res.length-ok),ok!==res.length);if(state.clipboardMove)state.clipboard=[];await navigate(state.path,{replace:true,mode:state.mode});}
 if(e.key==='F2'&&state.selected.size)handleAction('rename',state.items.find(i=>i.path===selectedItems()[0]));
 if(e.key==='Delete'&&state.selected.size)handleAction('trash',state.items.find(i=>i.path===selectedItems()[0]));
 if(e.altKey&&e.key==='ArrowLeft')$('#back').click();
 if(e.altKey&&e.key==='ArrowRight')$('#forward').click();
 if(e.altKey&&e.key==='ArrowUp')$('#up').click();
 if(e.key==='Enter'&&document.activeElement.closest('[data-item]')){const item=state.items.find(i=>i.path===document.activeElement.dataset.item);if(item)openItem(item);}
 if(mod&&e.key.toLowerCase()==='t'){e.preventDefault();createTab();}
 if(mod&&e.key.toLowerCase()==='w'){e.preventDefault();closeTab(state.activeTabId);}
 if(mod&&e.key.toLowerCase()==='\\'){e.preventDefault();toggleSplit();}
 if(e.key==='F5'){e.preventDefault();navigate(state.path,{replace:true,mode:state.mode});}
});
if(localStorage.getItem('bento-theme')==='light')document.body.classList.add('light-theme');
applyPreferences();
init().catch(e=>toast(e.message,true));




