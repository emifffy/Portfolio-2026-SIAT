// Shared navigation: hamburger menu + experience accordion
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const experienceItems = document.querySelectorAll('.experience-item');
    const body = document.body;

    function openMenu() {
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        body.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
    }

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            menuToggle.classList.contains('active') ? closeMenu() : openMenu();
        });

        // Close menu when clicking the overlay background
        menuOverlay.addEventListener('click', function (e) {
            if (e.target === menuOverlay) closeMenu();
        });

        // ESC closes the menu
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) closeMenu();
        });
    }

    // Mark the current page's link and close the menu on navigation
    const fileName = window.location.pathname.split('/').pop() || 'index.html';
    menuLinks.forEach(function (link) {
        if (link.getAttribute('href') === fileName) link.setAttribute('aria-current', 'page');
        link.addEventListener('click', closeMenu);
    });

    // Experience accordion (about page)
    experienceItems.forEach(function (item) {
        const header = item.querySelector('.experience-header');
        if (!header) return;
        header.addEventListener('click', function () {
            const isExpanded = item.classList.contains('expanded');
            experienceItems.forEach(function (other) {
                other.classList.remove('expanded');
                other.querySelector('.experience-header').setAttribute('aria-expanded', 'false');
            });
            if (!isExpanded) {
                item.classList.add('expanded');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Playful scroll reveals (about + play pages): each [data-reveal] block gets .is-in once.
    // Tall blocks count as "in" once they fill a third of the screen, since they can't reach 20%.
    const reveals = document.querySelectorAll('[data-reveal]');
    if (reveals.length && 'IntersectionObserver' in window) {
        const revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const fillsScreen = entry.rootBounds && entry.intersectionRect.height >= entry.rootBounds.height * 0.33;
                if (entry.intersectionRatio < 0.2 && !fillsScreen) return;
                entry.target.classList.add('is-in');
                revealer.unobserve(entry.target);
            });
        }, { threshold: [0, 0.1, 0.2, 0.3, 0.5], rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(function (el) { revealer.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-in'); });
    }

    // Fade work rows in as they scroll into view
    const rows = document.querySelectorAll('.work-row');
    if (rows.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        rows.forEach(function (row) { observer.observe(row); });
    } else {
        rows.forEach(function (row) { row.classList.add('in-view'); });
    }
});
