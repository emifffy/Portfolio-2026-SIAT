// Play page: section tabs, lightbox
// (scroll reveals for [data-reveal] live in hamburger.js; the title rises in with CSS)
(function () {
    // Tabs: highlight the section you're in
    const tabs = Array.from(document.querySelectorAll('.play-tab'));
    const sections = tabs.map(tab => document.querySelector(tab.getAttribute('href'))).filter(Boolean);
    if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                tabs.forEach(tab => {
                    const current = tab.getAttribute('href') === '#' + entry.target.id;
                    tab.classList.toggle('is-current', current);
                    if (current) tab.setAttribute('aria-current', 'true');
                    else tab.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(section => spy.observe(section));
    }

    // Lightbox: every .play-piece opens big, with ← → to flip through
    const pieces = Array.from(document.querySelectorAll('.play-piece'));
    const box = document.querySelector('.lightbox');
    if (!box || !pieces.length || typeof box.showModal !== 'function') return;

    const boxImg = box.querySelector('.lightbox-img');
    const boxCaption = box.querySelector('.lightbox-caption');
    let current = 0;
    let opener = null;

    function show(i) {
        current = (i + pieces.length) % pieces.length;
        const img = pieces[current].querySelector('img');
        boxImg.src = img.currentSrc || img.src;
        boxImg.alt = img.alt;
        boxCaption.textContent = pieces[current].dataset.caption || '';
        // Restart the pop each time you flip
        box.classList.remove('is-flipping');
        void box.offsetWidth;
        box.classList.add('is-flipping');
    }

    pieces.forEach((piece, i) => {
        piece.addEventListener('click', () => {
            opener = piece;
            show(i);
            box.showModal();
            document.body.classList.add('lightbox-open');
        });
    });

    box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
    box.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    box.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));

    // Click the dim backdrop (not the artwork) to close
    box.addEventListener('click', e => {
        if (e.target === box) box.close();
    });

    box.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });

    box.addEventListener('close', () => {
        document.body.classList.remove('lightbox-open');
        if (opener) opener.focus();
    });
})();
