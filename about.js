// About page: photo pop + "hi there!" bubble, doodle accents
// (scroll reveals for [data-reveal] live in hamburger.js)
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // "disappear" fades out letter by letter on hover; screen readers get the whole word
    const vanish = document.querySelector('.vanish');
    if (vanish) {
        const word = vanish.textContent.trim();
        vanish.textContent = '';
        const label = document.createElement('span');
        label.className = 'visually-hidden';
        label.textContent = word;
        vanish.append(label);
        Array.from(word).forEach((letter, i) => {
            const span = document.createElement('span');
            span.setAttribute('aria-hidden', 'true');
            span.textContent = letter;
            span.style.setProperty('--i', i);
            vanish.append(span);
        });

        // Play it once on its own so people know it's there
        const paragraph = vanish.closest('[data-reveal]');
        if (paragraph && !reduceMotion && 'IntersectionObserver' in window) {
            const demo = new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting) return;
                demo.disconnect();
                setTimeout(() => {
                    vanish.classList.add('is-gone');
                    setTimeout(() => vanish.classList.remove('is-gone'), 1500);
                }, 1600);
            }, { threshold: 0.6 });
            demo.observe(paragraph);
        }
    }

    // Photo: poke it to cycle the speech bubble
    const card = document.querySelector('.about-photo-card');
    const bubble = document.querySelector('.about-bubble-inner');
    const lines = [
        'hi there!',
        'thanks for stopping by',
        'no rocks were climbed',
        'say hi — email’s below ↓'
    ];
    let line = 0;

    if (card && bubble) {
        card.addEventListener('click', () => {
            line = (line + 1) % lines.length;
            bubble.textContent = lines[line];
            // Restart the pop/boing animations
            bubble.classList.remove('is-swapping');
            card.classList.remove('is-poked');
            void bubble.offsetWidth;
            bubble.classList.add('is-swapping');
            card.classList.add('is-poked');
        });

        // Gentle 3D tilt that follows the cursor
        if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
            card.addEventListener('pointermove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--tx', ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
                card.style.setProperty('--ty', ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tx', 0);
                card.style.setProperty('--ty', 0);
            });
        }
    }
})();
