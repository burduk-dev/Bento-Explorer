
/* Enhanced navigation: tabs, tag views, split pane, mouse gestures and drag/drop. */
function persistTabs(){localStorage.setItem('bento-tabs',JSON.stringify(state.tabs));}
function renderTabs(){
 const host=$('#tabs');if(!host)return;
 host.innerHTML=state.tabs.map(t=>'<div class="tab '+(t.id===state.activeTabId?'active':'')+'" data-tab="'+t.id+'" title="'+esc(t.path)+'"><span class="tab-icon">'+icon(t.mode==='tag'?'tag':t.mode==='home'?'home':'folder')+'</span><span class="tab-label">'+esc(t.label||'РќРѕРІР°СЏ РІРєР»Р°РґРєР°')+'</span><button class="tab-close" data-close-tab="'+t.id+'" title="Р—Р°РєСЂС‹С‚СЊ РІРєР»Р°РґРєСѓ">Г—</button></div>').join('');
}
function createTab(path=state.path,mode=state.mode,activate=true){
 const id=state.nextTabId++;const safeMode=mode==='tag'?'tag':mode==='home'?'home':'folder';
 const target=safeMode==='tag'?'tag://'+encodeURIComponent(state.currentTag):(path||state.path||'');
 state.tabs.push({id,path:target,mode:safeMode,label:safeMode==='tag'?'# '+state.currentTag:safeMode==='home'?'Р“Р»Р°РІРЅР°СЏ':basename(target)});persistTabs();if(activate){state.activeTabId=id;renderTabs();navigate(target||state.path,{replace:true,mode:safeMode,tabSwitch:true});}else renderTabs();
}
function safeTabPath(){return state.path&&!state.path.startsWith('tag://')?state.path:state.special.find(s=>s.name==='Desktop')?.path||state.path;}
function closeTab(id){
 if(state.tabs.length===1){state.tabs[0].path=safeTabPath();state.tabs[0].mode='home';state.tabs[0].label='Р“Р»Р°РІРЅР°СЏ';state.activeTabId=state.tabs[0].id;persistTabs();renderTabs();navigate(state.tabs[0].path,{replace:true,mode:'home'});return;}
 const idx=state.tabs.findIndex(t=>t.id===id);if(idx<0)return;state.tabs.splice(idx,1);
 if(state.activeTabId===id){const next=state.tabs[Math.max(0,idx-1)];state.activeTabId=next.id;persistTabs();renderTabs();navigate(next.path,{replace:true,mode:next.mode,tabSwitch:true});}else{persistTabs();renderTabs();}
}
async function refreshTagList(){
 state.tags=await window.bento.getTags();
 const host=$('#tag-stack');if(host)host.innerHTML=state.tags.length?state.tags.map(t=>'<button class="nav-item compact tag-item" data-tag="'+esc(t.name)+'" title="'+t.count+' СЌР»РµРјРµРЅС‚РѕРІ">'+icon('tag','nav-icon')+'<span>'+esc(t.name)+'</span><span class="tag-count">'+t.count+'</span></button>').join(''):'<div class="empty-favorites">РќР°Р·РЅР°С‡СЊС‚Рµ С‚РµРі С‡РµСЂРµР· РјРµРЅСЋ С„Р°Р№Р»Р°</div>';
}
async function loadRightPane(path=state.rightPath||state.path){
 try{const result=await window.bento.listDirectory(path);state.rightPath=result.path;state.rightParent=result.parent;state.rightItems=result.items;state.rightSelected.clear();renderRightPane();}catch(e){toast('РџСЂР°РІР°СЏ РїР°РЅРµР»СЊ: '+e.message,true);}
}
function renderRightPane(){
 const host=$('#file-area-right');if(!host)return;host.className='file-area '+(state.view==='grid'?'grid-view':'list-view');const items=state.rightItems||[];
 $('#right-address').value=state.rightPath||'';$('#right-status').textContent=items.length+' СЌР»РµРјРµРЅС‚РѕРІ'+(state.rightSelected.size?' В· '+state.rightSelected.size+' РІС‹Р±СЂР°РЅРѕ':'');
 if(!items.length){host.innerHTML='<div class="empty-state"><div class="empty-art">'+icon('folder-open')+'</div><h3>РџСѓСЃС‚Р°СЏ РїР°РїРєР°</h3><p>РџРµСЂРµС‚Р°С‰Рё СЃСЋРґР° С„Р°Р№Р»С‹ РёР»Рё РІС‹Р±РµСЂРё РґСЂСѓРіРѕР№ РїСѓС‚СЊ.</p></div>';return;}
 if(state.view==='list')host.innerHTML='<div class="list-header"><span>РРјСЏ</span><span>РР·РјРµРЅС‘РЅ</span><span>Р Р°Р·РјРµСЂ</span><span></span></div>'+items.map(i=>'<div class="file-row '+(state.rightSelected.has(i.path)?'is-selected':'')+'" data-right-item="'+esc(i.path)+'" draggable="true" tabindex="0"><div class="row-name"><span class="file-type '+colorFor(i)+'">'+icon(iconFor(i))+'</span><span class="file-name">'+esc(i.name)+'</span></div><span class="file-date">'+formatDate(i.modified)+'</span><span class="file-size">'+(i.isDirectory?'вЂ”':formatSize(i.size))+'</span></div>').join('');
 else host.innerHTML=items.map(i=>'<article class="file-card '+(state.rightSelected.has(i.path)?'is-selected':'')+'" data-right-item="'+esc(i.path)+'" draggable="true" tabindex="0"><div class="card-top"><span class="file-type '+colorFor(i)+'">'+icon(iconFor(i))+'</span></div><div class="file-name" title="'+esc(i.name)+'">'+esc(i.name)+'</div><div class="file-meta"><span>'+(i.isDirectory?'РџР°РїРєР°':esc((i.extension||'Р¤Р°Р№Р»').replace('.','').toUpperCase()))+'</span><span>'+(i.isDirectory?'':formatSize(i.size))+'</span></div><div class="card-footer"><span>'+formatDate(i.modified)+'</span></div>'+(i.tags?.length?'<div class="tag-chips">'+i.tags.map(t=>'<span class="tag-chip">#'+esc(t)+'</span>').join('')+'</div>':'')+'</article>').join('');
}
async function toggleSplit(force){
 state.split=typeof force==='boolean'?force:!state.split;$('#right-pane').classList.toggle('hidden',!state.split);$('#panes').classList.toggle('split',state.split);$('#split-toggle').classList.toggle('view-toggle-selected',state.split);
 if(state.split){if(!state.rightPath||state.rightPath.startsWith('tag://'))state.rightPath=state.path.startsWith('tag://')?(state.special[0]?.path||state.path):state.path;await loadRightPane();}
}
async function dropFiles(target,copy=false){
 const paths=state.draggedPaths||[];if(!paths.length)return;const result=await window.bento.pasteItems(paths,target,!copy);const ok=result.filter(x=>x.status==='ok').length;
 toast((copy?'РЎРєРѕРїРёСЂРѕРІР°РЅРѕ: ':'РџРµСЂРµРјРµС‰РµРЅРѕ: ')+ok+(result.length!==ok?' В· РѕС€РёР±РѕРє: '+(result.length-ok):''),result.length!==ok);state.draggedPaths=[];await navigate(state.path,{replace:true,mode:state.mode});if(state.split)await loadRightPane();
}
function attachDropZone(el,getDestination){
 if(!el)return;
 el.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('Files')&&!e.dataTransfer?.types.includes('application/x-bento-paths'))state.draggedPaths=[];if(state.draggedPaths.length||e.dataTransfer?.types.includes('application/x-bento-paths')||e.dataTransfer?.types.includes('Files')){e.preventDefault();e.dataTransfer.dropEffect=e.ctrlKey?'copy':'move';el.classList.add('drop-target');}});
 el.addEventListener('dragleave',e=>{if(!el.contains(e.relatedTarget))el.classList.remove('drop-target');});
 el.addEventListener('drop',async e=>{e.preventDefault();el.classList.remove('drop-target');const target=getDestination(e);if(!target)return;let paths=state.draggedPaths.length?state.draggedPaths:JSON.parse(e.dataTransfer.getData('application/x-bento-paths')||'[]');let external=false;if(!paths.length&&e.dataTransfer.files?.length){paths=Array.from(e.dataTransfer.files).map(file=>{try{return window.bento.getDroppedPath(file);}catch{return '';}}).filter(Boolean);external=paths.length>0;}if(!paths.length){toast('Could not get paths from the dragged files.',true);return;}state.draggedPaths=paths;await dropFiles(target,external||e.ctrlKey);});
}
function setupDragDrop(){
 const left=$('#file-area'),right=$('#file-area-right');
 document.addEventListener('dragstart',e=>{const card=e.target.closest('[data-item],[data-right-item]');if(!card)return;const isRight=card.hasAttribute('data-right-item');const itemPath=card.dataset.item||card.dataset.rightItem;const selected=isRight?state.rightSelected:state.selected;state.draggedPaths=selected.has(itemPath)?[...selected]:[itemPath];e.dataTransfer.setData('application/x-bento-paths',JSON.stringify(state.draggedPaths));e.dataTransfer.setData('text/plain',itemPath);e.dataTransfer.effectAllowed='copyMove';});
 attachDropZone(left,e=>{const card=e.target.closest('[data-item]');const item=card&&state.items.find(i=>i.path===card.dataset.item);return item?.isDirectory?item.path:state.path;});
 attachDropZone(right,e=>{const card=e.target.closest('[data-right-item]');const item=card&&state.rightItems.find(i=>i.path===card.dataset.rightItem);return item?.isDirectory?item.path:state.rightPath;});
}
function switchTabByOffset(offset){
 const index=state.tabs.findIndex(t=>t.id===state.activeTabId);if(index<0||state.tabs.length<2)return;
 const next=(index+offset+state.tabs.length)%state.tabs.length;const tab=state.tabs[next];state.activeTabId=tab.id;persistTabs();renderTabs();navigate(tab.path,{replace:true,mode:tab.mode,tabSwitch:true});
}
function setupGestures(){
 let points=[],trail=null,trailPath=null,trailDot=null;
 const ensureTrail=()=>{if(trail)return;trail=document.createElementNS('http://www.w3.org/2000/svg','svg');trail.id='gesture-trail';trail.setAttribute('viewBox','0 0 100 100');trail.setAttribute('preserveAspectRatio','none');trail.innerHTML='<polyline class="gesture-trail-line" points=""></polyline><circle class="gesture-trail-dot" cx="0" cy="0" r="4"></circle>';document.body.appendChild(trail);trailPath=trail.querySelector('polyline');trailDot=trail.querySelector('circle');};
 const drawTrail=()=>{if(!trail||!points.length)return;trail.setAttribute('viewBox','0 0 '+innerWidth+' '+innerHeight);trailPath.setAttribute('points',points.map(p=>p.x+','+p.y).join(' '));const p=points[points.length-1];trailDot.setAttribute('cx',p.x);trailDot.setAttribute('cy',p.y);};
 const showTrail=()=>{ensureTrail();trail.classList.add('visible');drawTrail();};
 const clearTrail=()=>{trail?.classList.remove('visible');points=[];if(trailPath)trailPath.setAttribute('points','');};
 document.addEventListener('mousedown',e=>{
  if(e.button===2){
   if(state.leftDown){state.gesture={kind:'rock',direction:'forward'};state.rightDown=true;state.rockingHandled=true;setTimeout(()=>state.rockingHandled=false,600);switchTabByOffset(1);e.preventDefault();return;}
   state.rightDown=true;state.gesture={kind:'right',x:e.clientX,y:e.clientY};points=[{x:e.clientX,y:e.clientY}];showTrail();
  }
  if(e.button===0){state.leftDown=true;if(state.rightDown){state.gesture={kind:'rock',direction:'back'};state.rockingHandled=true;setTimeout(()=>state.rockingHandled=false,600);switchTabByOffset(-1);e.preventDefault();}}
 });
 document.addEventListener('mousemove',e=>{
  const g=state.gesture;if(!state.rightDown||g?.kind!=='right')return;
  const p=points[points.length-1];if(!p||Math.hypot(e.clientX-p.x,e.clientY-p.y)>=4){points.push({x:e.clientX,y:e.clientY});showTrail();}
  const dx=e.clientX-g.x,dy=e.clientY-g.y;const hint=$('#gesture-hint');
  hint.textContent=Math.hypot(dx,dy)<20?'Р РёСЃСѓР№ Р¶РµСЃС‚вЂ¦':Math.abs(dx)>Math.abs(dy)?(dx<0?'в†ђ РќР°Р·Р°Рґ':'Р’РїРµСЂС‘Рґ в†’'):(dy<0?'в†‘ РќР° СѓСЂРѕРІРµРЅСЊ РІС‹С€Рµ':'в†“ РћР±РЅРѕРІРёС‚СЊ');
  hint.classList.remove('hidden');drawTrail();
 });
 document.addEventListener('mouseup',e=>{
  if(e.button===0)state.leftDown=false;if(e.button!==2)return;state.rightDown=false;const g=state.gesture;state.gesture=null;
  if(g?.kind==='rock'){state.rockingHandled=true;clearTrail();$('#gesture-hint').classList.add('hidden');return;}if(g?.kind!=='right')return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(Math.hypot(dx,dy)>=55){state.rockingHandled=true;setTimeout(()=>state.rockingHandled=false,600);if(Math.abs(dx)>Math.abs(dy)){if(dx<0)$('#back').click();else $('#forward').click();}else if(dy<0)$('#up').click();else navigate(state.path,{replace:true,mode:state.mode});}
  const hint=$('#gesture-hint');if(Math.hypot(dx,dy)<55)hint.classList.add('hidden');
  clearTimeout(hint.timer);hint.timer=setTimeout(()=>{hint.classList.add('hidden');clearTrail();},900);
 });
 document.addEventListener('contextmenu',e=>{if(state.rockingHandled){e.preventDefault();state.rockingHandled=false;}});
}
document.addEventListener('auxclick',e=>{
 if(e.button!==1)return;
 const card=e.target.closest('[data-item],[data-right-item]');if(!card)return;
 const path=card.dataset.item||card.dataset.rightItem;
 const item=(card.hasAttribute('data-right-item')?state.rightItems:state.items).find(i=>i.path===path);
 if(!item?.isDirectory)return;
 e.preventDefault();createTab(item.path,'folder',!!e.shiftKey);
});
$('#new-tab')?.addEventListener('click',()=>createTab());
$('#tabs')?.addEventListener('click',e=>{
 const close=e.target.closest('[data-close-tab]');if(close){e.stopPropagation();closeTab(Number(close.dataset.closeTab));return;}
 const tab=e.target.closest('[data-tab]');if(!tab)return;const id=Number(tab.dataset.tab);if(id===state.activeTabId)return;const item=state.tabs.find(t=>t.id===id);if(!item)return;state.activeTabId=id;persistTabs();renderTabs();navigate(item.path,{replace:true,mode:item.mode,tabSwitch:true});
});
$('#split-toggle')?.addEventListener('click',()=>toggleSplit());
$('#right-go')?.addEventListener('click',()=>loadRightPane($('#right-address').value.trim()));
$('#right-address')?.addEventListener('keydown',e=>{if(e.key==='Enter')loadRightPane($('#right-address').value.trim());if(e.key==='Escape')$('#right-address').value=state.rightPath;});
$('#right-up')?.addEventListener('click',()=>state.rightParent&&loadRightPane(state.rightParent));
state.rightLastClick=null;
$('#file-area-right')?.addEventListener('click',e=>{const card=e.target.closest('[data-right-item]');if(!card)return;const item=state.rightItems.find(i=>i.path===card.dataset.rightItem);if(!item)return;const now=Date.now();if(state.rightLastClick&&state.rightLastClick.path===item.path&&now-state.rightLastClick.time<420){state.rightLastClick=null;if(item.isDirectory)loadRightPane(item.path);else window.bento.openPath(item.path);return;}state.rightLastClick={path:item.path,time:now};if(!e.ctrlKey&&!e.metaKey)state.rightSelected.clear();if(state.rightSelected.has(item.path))state.rightSelected.delete(item.path);else state.rightSelected.add(item.path);$('#file-area-right').querySelectorAll('[data-right-item]').forEach(el=>el.classList.toggle('is-selected',state.rightSelected.has(el.dataset.rightItem)));$('#right-status').textContent=state.rightItems.length+' СЌР»РµРјРµРЅС‚РѕРІ В· '+state.rightSelected.size+' РІС‹Р±СЂР°РЅРѕ';});

$('#file-area-right')?.addEventListener('contextmenu',e=>{const card=e.target.closest('[data-right-item]');if(!card)return;e.preventDefault();const item=state.rightItems.find(i=>i.path===card.dataset.rightItem);if(item)showContext(item,e.clientX,e.clientY);});
$('#add-tag')?.addEventListener('click',async()=>{const name=prompt('РќР°Р·РІР°РЅРёРµ РЅРѕРІРѕРіРѕ С‚РµРіР°.');if(!name)return;try{await window.bento.createTag(name);await refreshTagList();toast('РўРµРі СЃРѕР·РґР°РЅ: #'+name.trim().replace(/^#/,'').trim());}catch(err){toast(err.message,true);}});
document.addEventListener('click',e=>{const tag=e.target.closest('[data-tag]');if(tag){navigate('tag://'+encodeURIComponent(tag.dataset.tag),{mode:'tag'});return;}if(e.target.closest('[data-tag-breadcrumb]'))toast('Р’С‹Р±РµСЂРё С‚РµРі РІ Р±РѕРєРѕРІРѕР№ РїР°РЅРµР»Рё.');});
(async()=>{
 if(!state.tabs.length)state.tabs=[{id:state.nextTabId++,path:'',mode:'home',label:'Р“Р»Р°РІРЅР°СЏ'}];
 state.nextTabId=Math.max(1,...state.tabs.map(t=>Number(t.id)||0))+1;state.activeTabId=state.tabs[0].id;renderTabs();await refreshTagList();setupDragDrop();setupGestures();
})();




$('#toggle-sidebar')?.addEventListener('click',()=>{const p=JSON.parse(localStorage.getItem('bento-preferences')||'{}');p.hideSidebar=!p.hideSidebar;localStorage.setItem('bento-preferences',JSON.stringify(p));document.body.classList.toggle('sidebar-collapsed',p.hideSidebar);});
$('#settings-save')?.addEventListener('click',()=>savePreferences());
$('#settings-cancel')?.addEventListener('click',()=>$('#settings-dialog').close());


