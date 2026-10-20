// Landing page: word entrance, hover media pop-ups, "Hover over me!" hint, scroll-to-work
(function () {
    const body = document.body;
    const heroText = document.querySelector('.hero-text');
    const hint = document.querySelector('.hover-hint');
    const hoverWords = Array.from(document.querySelectorAll('.hw'));

    // Wrap each word in a span so it can animate in; hover words stay one unit
    let index = 0;
    Array.from(heroText.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'BR') return;
            node.classList.add('w');
            node.style.setProperty('--i', index++);
            return;
        }
        const words = node.textContent.split(/\s+/).filter(Boolean);
        const fragment = document.createDocumentFragment();
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = word;
            span.style.setProperty('--i', index++);
            fragment.append(span, ' ');
        });
        if (/^\s/.test(node.textContent)) fragment.prepend(' ');
        node.replaceWith(fragment);
    });

    // Keep "{ word }" together so a bracket never wraps away from its word
    hoverWords.forEach(word => {
        const open = word.previousElementSibling;
        const close = word.nextElementSibling;
        if (!open || !close || !open.textContent.endsWith('{') || !close.textContent.startsWith('}')) return;
        const group = document.createElement('span');
        group.className = 'nb';
        open.before(group);
        group.append(open, ' ', word, ' ', close);
    });

    // Hover media
    function activate(word) {
        hoverWords.forEach(other => { if (other !== word) deactivate(other); });
        word.classList.add('is-active');
        const video = word.querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
        }
        hideHint();
    }

    function deactivate(word) {
        if (!word.classList.contains('is-active')) return;
        word.classList.remove('is-active');
        const video = word.querySelector('video');
        if (video) video.pause();
    }

    hoverWords.forEach(word => {
        word.addEventListener('pointerenter', e => {
            if (e.pointerType === 'mouse') activate(word);
        });
        word.addEventListener('pointerleave', e => {
            if (e.pointerType === 'mouse') deactivate(word);
        });
        word.addEventListener('focus', () => activate(word));
        word.addEventListener('blur', () => deactivate(word));
        // Touch: tap to toggle
        word.addEventListener('click', () => {
            word.classList.contains('is-active') ? deactivate(word) : activate(word);
        });
    });

    document.addEventListener('pointerdown', e => {
        if (!e.target.closest('.hw')) hoverWords.forEach(deactivate);
    });

    // "Hover over me!" pops up when the mouse moves, and nudges again after a pause
    const HINT_DELAY = 1100;
    const IDLE_BEFORE_NUDGE = 1800;
    const readyAt = performance.now() + HINT_DELAY;
    let lastMove = 0;
    let hintRetired = false;

    function showHint() {
        if (hintRetired) return;
        if (!hint.classList.contains('is-visible')) {
            hint.classList.add('is-visible');
        } else {
            hint.classList.remove('is-nudged');
            void hint.offsetWidth; // restart the nudge animation
            hint.classList.add('is-nudged');
        }
    }

    function hideHint() {
        hint.classList.remove('is-visible', 'is-nudged');
    }

    document.addEventListener('mousemove', () => {
        const now = performance.now();
        if (now < readyAt) return;
        const anyActive = hoverWords.some(w => w.classList.contains('is-active'));
        if (!anyActive && (!hint.classList.contains('is-visible') || now - lastMove > IDLE_BEFORE_NUDGE)) {
            showHint();
        }
        lastMove = now;
    });

    // Once someone has found a few of the words, the hint has done its job
    let discovered = new Set();
    hoverWords.forEach(word => word.addEventListener('pointerenter', () => {
        discovered.add(word);
        if (discovered.size >= 3) hintRetired = true;
    }));

    // Scroll for more → work page
    const cue = document.querySelector('.scroll-cue');
    let leaving = false;

    function goToWork() {
        if (leaving || body.classList.contains('menu-open')) return;
        leaving = true;
        body.classList.add('leaving');
        setTimeout(() => { window.location.href = cue.getAttribute('href'); }, 420);
    }

    cue.addEventListener('click', e => {
        e.preventDefault();
        goToWork();
    });

    let wheelTotal = 0;
    let wheelTimer;
    window.addEventListener('wheel', e => {
        if (e.deltaY <= 0) return;
        wheelTotal += e.deltaY;
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => { wheelTotal = 0; }, 250);
        if (wheelTotal > 60) goToWork();
    }, { passive: true });

    let touchStartY = null;
    window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', e => {
        if (touchStartY === null) return;
        if (touchStartY - e.changedTouches[0].clientY > 60) goToWork();
        touchStartY = null;
    });

    document.addEventListener('keydown', e => {
        if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.target.closest('button, a, .hw')) {
            e.preventDefault();
            goToWork();
        }
    });

    // Coming back with the browser's back button shouldn't leave the page faded out
    window.addEventListener('pageshow', e => {
        if (e.persisted) {
            leaving = false;
            body.classList.remove('leaving');
        }
    });
})();
