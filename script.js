
// Close Hero Overlay Function
function closeHeroOverlay() {
    const heroContainer = document.querySelector('.hero-text-container');
    if (heroContainer) {
        heroContainer.style.display = 'none';
        heroContainer.classList.add('hidden');
    }
}

// Show overlay again when carousel changes - but only if not manually closed
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('heroCarousel');
    let overlayClosed = false;
    
    if (carousel) {
        // Override the close function to track manual closure
        window.closeHeroOverlay = function() {
            overlayClosed = true;
            const heroContainer = document.querySelector('.hero-text-container');
            if (heroContainer) {
                heroContainer.style.display = 'none';
                heroContainer.classList.add('hidden');
            }
        };
        
        carousel.addEventListener('slide.bs.carousel', function() {
            // Only show overlays if they weren't manually closed
            if (!overlayClosed) {
                const heroContainer = document.querySelector('.hero-text-container');
                if (heroContainer) {
                    heroContainer.style.display = 'block';
                    heroContainer.classList.remove('hidden');
                }
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Start counter animation if this is a stat number element
                if (entry.target.classList.contains('stat-item')) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber) {
                        // Get the type of stat based on the stat-label text content
                        const statLabel = entry.target.querySelector('.stat-label');
                        let targetValue = 0;
                        let suffix = '';
                        
                        if (statLabel) {
                            const labelText = statLabel.textContent.toLowerCase();
                            
                            // Set specific targets based on the type of statistic
                            if (labelText.includes('events')) {
                                targetValue = 500;
                                suffix = '+';
                            } else if (labelText.includes('guests')) {
                                targetValue = 50;
                                suffix = 'K+';
                            } else if (labelText.includes('years') || labelText.includes('expertise')) {
                                targetValue = 15;
                                suffix = '+';
                            }
                        }
                        
                        animateCounter(statNumber, targetValue, suffix);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Counter animation function
    function animateCounter(element, targetValue, suffix) {
        const duration = 2000; // 2 seconds
        const frameDuration = 1000/60; // 60fps
        const totalFrames = duration / frameDuration;
        let frame = 0;
        
        // Start from 0
        element.textContent = '0';
        
        // Animate the counter
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(targetValue * progress);
            
            // Update the element text with the current count
            element.textContent = currentCount + (frame === totalFrames ? suffix : '');
            
            // IMPORTANT: Stop the animation when it reaches the target value
            if (frame === totalFrames || currentCount >= targetValue) {
                clearInterval(counter); // Stop the counter animation immediately
                // Set the final number with suffix and never count beyond this
                element.textContent = targetValue + suffix;
                return; // Exit the interval function completely
            }
        }, frameDuration);
    }
    
    // Helper function to parse the target number from various formats
    function parseTargetNumber(text) {
        // Remove any non-numeric characters except for decimal points
        let numericValue = text.replace(/[^0-9.]/g, '');
        
        // If the text contains 'K', multiply by 1000
        if (text.includes('K')) {
            return parseFloat(numericValue) * 1000;
        }
        
        return parseFloat(numericValue);
    }

    // Observe elements for animation
    document.querySelectorAll('.event-card, .feature-card, .highlight-card').forEach(el => {
        observer.observe(el);
    });
    
    // Observe stat items separately to trigger counter animations
    document.querySelectorAll('.stat-item').forEach(el => {
        observer.observe(el);
    });
});

// Initialize Bootstrap tooltips and popovers if needed
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});
function openServiceModal(serviceType) {
    // Service type mapping to handle all services
    const modalMapping = {
        'djSetup': 'dj',
        'spinBooth': 'spin',
        'welcomeGirls': 'welcome',
        'kidsSweets': 'kids',
        'ledWall': 'led',
        'tvRental': 'tv',
        'honeycomb': 'honeycomb',
        'themeDecor': 'themeDecor', // fixed
        'mehndiArt': 'mehndi',
        'nailArt': 'nailArt',       // fixed
        'catering': 'catering',
        'candyStalls': 'popcorn'    // also corrected from earlier
    };
    
    
    // Get the correct modal ID or use default
    const modalId = (modalMapping[serviceType] || serviceType) + 'Modal';
    
    // Hide any currently open modals
    $('.modal.show').modal('hide');
    
    // Show the requested modal
    $('#' + modalId).modal('show');
}

// JavaScript for hover dropdowns (Added by Cascade)
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function (dropdown) {
        let dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        let dropdownMenu = dropdown.querySelector('.dropdown-menu');
        let bsDropdown;

        if (dropdownToggle) {
            bsDropdown = new bootstrap.Dropdown(dropdownToggle);
        }

        dropdown.addEventListener('mouseenter', function () {
            if (bsDropdown && dropdownMenu && !dropdownMenu.classList.contains('show')) {
                bsDropdown.show();
            }
        });

        dropdown.addEventListener('mouseleave', function () {
            if (bsDropdown && dropdownMenu && dropdownMenu.classList.contains('show')) {
                // Add a small delay to allow moving mouse from toggle to menu
                setTimeout(function() {
                    // Check if mouse is still outside the dropdown area
                    if (!dropdown.matches(':hover')) {
                         bsDropdown.hide();
                    }
                }, 200); // 200ms delay
            }
        });
    });
});
