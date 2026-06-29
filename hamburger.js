// Simplified Portfolio Navigation - Debug Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing navigation...');
    
    // Get elements
    const themeToggle = document.querySelector('.theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const experienceItems = document.querySelectorAll('.experience-item');
    const body = document.body;
    
    // Debug: Log if elements are found
    console.log('Elements found:', {
        themeToggle: !!themeToggle,
        menuToggle: !!menuToggle,
        menuOverlay: !!menuOverlay,
        menuLinksCount: menuLinks.length,
        experienceItemsCount: experienceItems.length
    });
    
    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        console.log('Theme initialized:', savedTheme);
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        console.log('Theme toggled to:', newTheme);
    }
    
    // Toggle menu
    function toggleMenu() {
        console.log('Toggle menu clicked');
        const isActive = menuToggle.classList.contains('active');
        console.log('Menu currently active:', isActive);
        
        if (isActive) {
            // Close menu
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.style.overflow = '';
            console.log('Menu closed');
        } else {
            // Open menu
            menuToggle.classList.add('active');
            menuOverlay.classList.add('active');
            body.style.overflow = 'hidden';
            console.log('Menu opened');
        }
    }
    
    // Close menu
    function closeMenu() {
        console.log('Closing menu');
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    // Set active navigation
    function setActiveNavigation() {
        const currentPage = window.location.pathname;
        const fileName = currentPage.split('/').pop() || 'index.html';
        console.log('Current page:', fileName);
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === fileName || (fileName === '' && linkHref === 'index.html')) {
                link.classList.add('active');
                console.log('Set active:', linkHref);
            }
        });
    }
    
    // Toggle experience item
    function toggleExperienceItem(clickedItem) {
        const isExpanded = clickedItem.classList.contains('expanded');
        const expandBtn = clickedItem.querySelector('.expand-btn');
        
        // Close all other experience items
        experienceItems.forEach(item => {
            if (item !== clickedItem) {
                item.classList.remove('expanded');
                const btn = item.querySelector('.expand-btn');
                if (btn) btn.textContent = '+';
            }
        });
        
        // Toggle the clicked item
        clickedItem.classList.toggle('expanded');
        if (expandBtn) {
            expandBtn.textContent = isExpanded ? '+' : '×';
        }
    }
    
    // Bind events
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Theme toggle bound');
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        console.log('Menu toggle bound');
    } else {
        console.error('Menu toggle button not found!');
    }
    
    // Menu navigation links
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Menu link clicked:', link.getAttribute('href'));
            closeMenu();
        });
    });
    
    // Experience items accordion
    experienceItems.forEach(item => {
        const header = item.querySelector('.experience-header');
        if (header) {
            header.addEventListener('click', function() {
                toggleExperienceItem(item);
            });
        }
    });
    
    // Close menu when clicking overlay background
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }
    
    // Keyboard navigation (ESC to close menu)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Initialize
    initializeTheme();
    setActiveNavigation();
    
    console.log('Navigation system initialized');
});