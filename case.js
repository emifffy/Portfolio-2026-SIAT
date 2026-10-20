// Case study scroll interactions: reveals, progress bar, video play-in-view
(function () {
    document.documentElement.classList.add('js');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal, .reveal-media');

    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
        targets.forEach(function (el) { io.observe(el); });
    } else {
        targets.forEach(function (el) { el.classList.add('in-view'); });
    }

    // Videos only play while on screen
    const videos = document.querySelectorAll('.cs video');
    if ('IntersectionObserver' in window) {
        const vio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) entry.target.play().catch(function () {});
                else entry.target.pause();
            });
        }, { threshold: 0.25 });
        videos.forEach(function (v) { vio.observe(v); });
    }

    // Film quote: roll the clip in while the band is on screen, back out when it leaves
    const films = document.querySelectorAll('.cs-film');
    if ('IntersectionObserver' in window && !reduce) {
        const fio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle('is-rolling', entry.isIntersecting);
            });
        }, { rootMargin: '0px 0px -20% 0px', threshold: 0.35 });
        films.forEach(function (el) { fio.observe(el); });
    } else {
        films.forEach(function (el) { el.classList.add('is-rolling'); });
    }

    // Scroll progress bar
    const root = document.documentElement;
    const progress = document.querySelector('.cs-progress');
    let ticking = false;

    function update() {
        ticking = false;
        const max = root.scrollHeight - window.innerHeight;
        if (progress) progress.style.setProperty('--p', max > 0 ? window.scrollY / max : 0);
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
