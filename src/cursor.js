/* Minimal custom cursor: instant dot, softly lagging ring, semantic states. */
(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const style = document.createElement('style');
  style.textContent = `
    body.bento-cursor-on, body.bento-cursor-on * { cursor: none !important; }
    #bento-cursor { position: fixed; left: 0; top: 0; z-index: 99999; pointer-events: none; opacity: 0; }
    #bento-cursor.is-visible { opacity: 1; }
    #bento-cursor .cursor-dot { position: fixed; left: 0; top: 0; width: 5px; height: 5px; border-radius: 50%; background: #e9efff; border: 1px solid rgba(38,48,73,.55); transform: translate(-50%,-50%); box-shadow: 0 0 0 1px rgba(255,255,255,.18); }
    #bento-cursor .cursor-ring { position: fixed; left: 0; top: 0; width: 25px; height: 25px; border: 1px solid rgba(160,177,218,.7); border-radius: 50%; background: rgba(140,164,219,.035); transform: translate(-50%,-50%); transition: width .16s ease, height .16s ease, border-color .14s ease, background .14s ease, border-radius .14s ease; box-shadow: 0 1px 8px rgba(0,0,0,.08); }
    #bento-cursor.is-interactive .cursor-dot { background: #a9c3ff; border-color: #7899ee; }
    #bento-cursor.is-interactive .cursor-ring { width: 31px; height: 31px; border-color: #83a6ff; background: rgba(112,148,255,.11); }
    #bento-cursor.is-pressed .cursor-ring { width: 20px; height: 20px; background: rgba(112,148,255,.22); }
    #bento-cursor.is-text .cursor-ring { width: 13px; height: 27px; border-radius: 5px; border-color: #8da9e8; background: rgba(112,148,255,.06); }
    #bento-cursor.is-text .cursor-dot { width: 2px; height: 13px; border-radius: 1px; background: #dbe5ff; }
    #bento-cursor.is-crosshair .cursor-ring { width: 25px; height: 25px; border-color: #9cb7ff; background: transparent; }
    #bento-cursor.is-crosshair .cursor-ring:before, #bento-cursor.is-crosshair .cursor-ring:after { content: ''; position: absolute; background: currentColor; opacity: .8; }
    #bento-cursor.is-crosshair .cursor-ring:before { width: 1px; height: 37px; left: 11px; top: -7px; }
    #bento-cursor.is-crosshair .cursor-ring:after { height: 1px; width: 37px; top: 11px; left: -7px; }
    #bento-cursor.is-grab .cursor-ring, #bento-cursor.is-grabbing .cursor-ring { width: 29px; height: 29px; border-color: #a2b3d8; }
    #bento-cursor.is-grabbing .cursor-ring { width: 22px; height: 22px; border-color: #83a6ff; background: rgba(112,148,255,.17); }
    #bento-cursor.is-not-allowed .cursor-dot, #bento-cursor.is-not-allowed .cursor-ring { background: rgba(255,105,105,.12); border-color: #ee8a8a; }
    #bento-cursor.is-wait .cursor-ring, #bento-cursor.is-progress .cursor-ring { border-top-color: transparent; animation: bento-cursor-spin .8s linear infinite; }
    #bento-cursor.is-move .cursor-ring { width: 30px; height: 30px; border-style: dashed; border-color: #9eb5f1; }
    #bento-cursor.is-resize .cursor-ring { width: 27px; height: 27px; border-radius: 5px; border-color: #9eb5f1; }
    #bento-cursor.is-zoom-in .cursor-ring, #bento-cursor.is-zoom-out .cursor-ring { width: 27px; height: 27px; border-color: #9eb5f1; }
    #bento-cursor.is-help .cursor-ring, #bento-cursor.is-context-menu .cursor-ring { border-style: dotted; border-color: #c3b2ff; }
    #bento-cursor.is-copy .cursor-ring, #bento-cursor.is-alias .cursor-ring { width: 30px; height: 30px; border-style: dashed; border-color: #83a6ff; background: rgba(112,148,255,.08); }
    #bento-cursor.is-no-drop .cursor-dot, #bento-cursor.is-no-drop .cursor-ring { border-color: #ee8a8a; background: rgba(255,105,105,.12); }
    #bento-cursor.is-cell .cursor-ring { width: 25px; height: 25px; border-radius: 4px; border-color: #9cb7ff; }
    #bento-cursor.is-vertical-text .cursor-ring { width: 13px; height: 27px; border-radius: 5px; border-color: #8da9e8; }
    @keyframes bento-cursor-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { #bento-cursor .cursor-ring { transition: none; } }
  `;
  document.head.appendChild(style);
  const cursor = document.createElement('div');
  cursor.id = 'bento-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';
  document.body.appendChild(cursor);
  document.body.classList.add('bento-cursor-on');
  // Restore the native cursor while a modal is in the browser's top layer.
  const nativeShowModal = HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal = function(...args) {
    document.body.classList.remove('bento-cursor-on');
    cursor.classList.remove('is-visible');
    return nativeShowModal.apply(this, args);
  };
  document.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.add('bento-cursor-on');
  }, true);
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  let x = -100, y = -100, rx = x, ry = y, raf = 0;
  const interactiveSelector = 'button,a,[role="button"],[role="menuitem"],summary,.file-card,.file-row,.tab,.quick-card,.nav-item,[data-item],[data-right-item],[data-route],[data-special],[data-view],[data-close-tab],.icon-button,.primary-button,.secondary-button';
  function cursorType(target) {
    if (!target) return 'default';
    const hidden = document.body.classList.contains('bento-cursor-on');
    if (hidden) document.body.classList.remove('bento-cursor-on');
    const computed = getComputedStyle(target).cursor;
    if (hidden) document.body.classList.add('bento-cursor-on');
    if (target.matches('input,textarea,[contenteditable="true"]') || computed === 'text') return 'text';
    if (target.matches(':disabled,[aria-disabled="true"]') || computed === 'not-allowed') return 'not-allowed';
    if (computed === 'wait') return 'wait';
    if (computed === 'progress') return 'progress';
    if (computed === 'crosshair' || computed === 'cell') return computed === 'cell' ? 'cell' : 'crosshair';
    if (computed === 'copy') return 'copy';
    if (computed === 'alias') return 'alias';
    if (computed === 'no-drop') return 'no-drop';
    if (computed === 'vertical-text') return 'vertical-text';
    if (computed === 'context-menu') return 'context-menu';
    if (computed === 'grab') return 'grab';
    if (computed === 'grabbing') return 'grabbing';
    if (computed === 'move' || computed === 'all-scroll') return 'move';
    if (/(e|w|n|s|ne|nw|se|sw)-resize$|^(col|row)-resize$/.test(computed)) return 'resize';
    if (computed === 'zoom-in') return 'zoom-in';
    if (computed === 'zoom-out') return 'zoom-out';
    if (computed === 'help') return 'help';
    if (computed === 'pointer' || target.closest(interactiveSelector)) return 'pointer';
    return 'default';
  }
  function updateState(target) {
    const type = cursorType(target);
    cursor.className = 'is-visible is-' + type;
    if (type === 'pointer') cursor.classList.add('is-interactive');
    if (document.documentElement.classList.contains('bento-cursor-pressed')) cursor.classList.add('is-pressed');
  }
  function animate() {
    rx += (x - rx) * .22;
    ry += (y - ry) * .22;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
    if (Math.abs(x-rx) > .1 || Math.abs(y-ry) > .1) raf = requestAnimationFrame(animate);
    else raf = 0;
  }
  document.addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
    if (!cursor.classList.contains('is-visible')) { rx=x; ry=y; cursor.classList.add('is-visible'); }
    if (!raf) raf = requestAnimationFrame(animate);
  }, {passive:true});
  document.addEventListener('mouseover', e => updateState(e.target), {passive:true});
  document.addEventListener('mousedown', () => { document.documentElement.classList.add('bento-cursor-pressed'); cursor.classList.add('is-pressed'); }, true);
  document.addEventListener('mouseup', () => { document.documentElement.classList.remove('bento-cursor-pressed'); cursor.classList.remove('is-pressed'); }, true);
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'), true);
  window.addEventListener('blur', () => cursor.classList.remove('is-visible'));
})();
