// Make the first .window.glass.active draggable by its .title-bar
(function () {
    const win = document.querySelector('.window.glass.active');
    if (!win) return;
    const title = win.querySelector('.title-bar');
    if (!title) return;

    let dragging = false;
    let offsetX = 0,
        offsetY = 0;
    let userMoved = false; // becomes true if user drags the window

    function centerWin() {
        // center only if user hasn't moved it
        if (userMoved) return;
        // ensure absolute positioning
        const rect = win.getBoundingClientRect();
        win.style.position = 'absolute';
        const vpW = document.documentElement.clientWidth;
        const vpH = document.documentElement.clientHeight;
        const w = rect.width,
            h = rect.height;
        win.style.left = Math.max(0, Math.round((vpW - w) / 2)) + 'px';
        win.style.top = Math.max(0, Math.round((vpH - h) / 2)) + 'px';
    }

    function onPointerDown(e) {
        // Only primary button
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // Ignore drags started on the title-bar controls (buttons, tooltips, etc.)
        if (e.target.closest && e.target.closest('.title-bar-controls')) return;
        const rect = win.getBoundingClientRect();

        // ensure absolute positioning with current screen coords
        if (getComputedStyle(win).position !== 'absolute') {
            win.style.position = 'absolute';
            win.style.left = rect.left + 'px';
            win.style.top = rect.top + 'px';
        }

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        dragging = true;
        win.classList.add('dragging');
        try { if (title.setPointerCapture) title.setPointerCapture(e.pointerId); } catch (_) { }
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
        e.preventDefault();
    }

    // fallback for browsers without pointer events
    title.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        if (e.target.closest && e.target.closest('.title-bar-controls')) return;
        // synthesize a pointer-like event object for reuse
        onPointerDown({ pointerType: 'mouse', button: 0, clientX: e.clientX, clientY: e.clientY, pointerId: 1, preventDefault() { e.preventDefault(); } });
    });

    function onPointerMove(e) {
        if (!dragging) return;
        // when movement happens, mark that user moved the window
        userMoved = true;
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        // keep within viewport bounds
        const vpW = document.documentElement.clientWidth;
        const vpH = document.documentElement.clientHeight;
        const rect = win.getBoundingClientRect();
        const w = rect.width,
            h = rect.height;

        win.style.left = Math.min(Math.max(0, newLeft), vpW - w) + 'px';
        win.style.top = Math.min(Math.max(0, newTop), vpH - h) + 'px';
    }

    function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;
        win.classList.remove('dragging');
        try { if (title.releasePointerCapture) title.releasePointerCapture(e.pointerId); } catch (_) { }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
    }

    title.addEventListener('pointerdown', onPointerDown);

    // center on load
    window.addEventListener('DOMContentLoaded', centerWin);
    // also try immediate (in case DOMContentLoaded already fired)
    if (document.readyState !== 'loading') centerWin();
    // re-center on resize if user hasn't moved the window
    window.addEventListener('resize', () => {
        // small debounce
        clearTimeout(window.__centerTimeout);
        window.__centerTimeout = setTimeout(centerWin, 80);
    });

    // --- Tooltip toggle for title-bar controls (balloon-password) ---
    (function tooltipToggle() {
        const controls = win.querySelectorAll('.title-bar-controls > button[aria-describedby="balloon-password"]');
        const tooltip = win.querySelector('#balloon-password');
        if (!tooltip || controls.length === 0) return;

        // initialize accessibility state
        tooltip.setAttribute('aria-hidden', tooltip.hasAttribute('hidden') ? 'true' : 'false');
        controls.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        let hideTimer = null;

        function showTooltip() {
            tooltip.removeAttribute('hidden');
            tooltip.setAttribute('aria-hidden', 'false');
            controls.forEach(b => b.setAttribute('aria-expanded', 'true'));
            // auto-hide after 3.5s
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideTooltip, 3500);
        }
        function hideTooltip() {
            tooltip.setAttribute('hidden', '');
            tooltip.setAttribute('aria-hidden', 'true');
            controls.forEach(b => b.setAttribute('aria-expanded', 'false'));
            clearTimeout(hideTimer);
        }
        function toggleTooltip() {
            if (tooltip.hasAttribute('hidden')) showTooltip(); else hideTooltip();
        }

        controls.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                toggleTooltip();
            });
        });

        // allow clicking the tooltip itself to hide it
        tooltip.addEventListener('click', (ev) => {
            ev.stopPropagation();
            hideTooltip();
        });

        // hide when clicking outside or pressing Escape
        document.addEventListener('click', () => hideTooltip());
        document.addEventListener('keyup', (ev) => { if (ev.key === 'Escape') hideTooltip(); });
    })();

    // --- Custom context menu (disable native menu, show app-like menu) ---
    (function customContextMenu() {
        const menu = document.getElementById('custom-context-menu');
        if (!menu) return;

        function hideMenu() {
            menu.setAttribute('aria-hidden', 'true');
            menu.style.display = 'none';
        }

        function showMenuAt(x, y) {
            // make visible to measure
            menu.style.display = 'block';
            menu.removeAttribute('aria-hidden');
            const mRect = menu.getBoundingClientRect();
            const vpW = document.documentElement.clientWidth;
            const vpH = document.documentElement.clientHeight;
            // constrain inside viewport
            let left = x;
            let top = y;
            if (left + mRect.width > vpW) left = Math.max(4, vpW - mRect.width - 4);
            if (top + mRect.height > vpH) top = Math.max(4, vpH - mRect.height - 4);
            menu.style.left = left + 'px';
            menu.style.top = top + 'px';
        }

        // intercept native context menu
        document.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
            // show menu only when clicking in the app surface, otherwise ignore
            showMenuAt(ev.clientX, ev.clientY);
            ev.stopPropagation();
        }, { passive: false });

        // menu action handlers
        menu.addEventListener('click', (ev) => {
            const item = ev.target.closest('.menu-item');
            if (!item) return;
            const action = item.dataset.action;
            hideMenu();
            switch (action) {
                case 'help': {
                    const tooltip = win.querySelector('#balloon-password');
                    if (!tooltip) break;
                    if (tooltip.hasAttribute('hidden')) {
                        tooltip.removeAttribute('hidden');
                        tooltip.setAttribute('aria-hidden', 'false');
                    } else {
                        tooltip.setAttribute('hidden', '');
                        tooltip.setAttribute('aria-hidden', 'true');
                    }
                    break;
                }
                case 'minimize':
                    win.style.display = 'none';
                    break;
                case 'maximize': {
                    const vpW = document.documentElement.clientWidth;
                    const vpH = document.documentElement.clientHeight;
                    if (!win.dataset.maximized) {
                        const r = win.getBoundingClientRect();
                        win.dataset.prev = JSON.stringify({
                            left: win.style.left || r.left + 'px',
                            top: win.style.top || r.top + 'px',
                            width: win.style.width || r.width + 'px',
                            height: win.style.height || win.style.height || ''
                        });
                        win.style.left = '0px';
                        win.style.top = '0px';
                        win.style.width = vpW + 'px';
                        win.style.height = vpH + 'px';
                        win.dataset.maximized = '1';
                    } else {
                        try {
                            const prev = JSON.parse(win.dataset.prev || '{}');
                            if (prev.left) win.style.left = prev.left;
                            if (prev.top) win.style.top = prev.top;
                            if (prev.width) win.style.width = prev.width;
                            if (prev.height) win.style.height = prev.height;
                        } catch (e) { /* ignore */ }
                        delete win.dataset.maximized;
                    }
                    break;
                }
                case 'close':

                    if (win.style.display === 'none') {
                        win.style.display = 'block';
                    } else {
                        win.style.display = 'none';
                    }
                    break;
                case 'legacy':
                    location.href = 'index-old.html';
                    break;
            }
        });

        // hide on outside click / Escape
        document.addEventListener('click', (ev) => {
            if (!ev.target.closest('#custom-context-menu')) hideMenu();
        });
        document.addEventListener('keyup', (ev) => { if (ev.key === 'Escape') hideMenu(); });
    })();
})();
