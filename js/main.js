/**
 * MADE Servizi - Main JavaScript
 * Lightweight, performance-optimized interactions
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initMobileMenu();
        initSmoothScroll();
        initCounterAnimation();
        initFormValidation();
        initScrollAnimations();
        initHeaderScroll();
    }

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (!menuToggle || !navLinks) return;

        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Update aria-expanded
            const isExpanded = navLinks.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth Scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /**
     * Counter Animation for stats
     */
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        // Use Intersection Observer for triggering animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Form Validation
     */
    function initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                removeError(field);

                if (!field.value.trim()) {
                    showError(field, 'Questo campo è obbligatorio');
                    isValid = false;
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    showError(field, 'Inserisci un indirizzo email valido');
                    isValid = false;
                } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    showError(field, 'Inserisci un numero di telefono valido');
                    isValid = false;
                } else if (field.type === 'checkbox' && !field.checked) {
                    showError(field, 'Devi accettare la privacy policy');
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                showFormSuccess(form);

                // Here you would typically send the data to a server
                console.log('Form submitted:', data);

                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                }, 3000);
            }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && this.value.trim()) {
                    removeError(this);
                }
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\d\s\+\-\(\)]{8,}$/.test(phone);
    }

    function showError(field, message) {
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!formGroup) return;

        formGroup.classList.add('has-error');

        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #ef4444; font-size: 0.8125rem; margin-top: 0.25rem;';
        formGroup.appendChild(errorDiv);

        if (field.style) {
            field.style.borderColor = '#ef4444';
        }
    }

    function removeError(field) {
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!formGroup) return;

        formGroup.classList.remove('has-error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();

        if (field.style) {
            field.style.borderColor = '';
        }
    }

    function showFormSuccess(form) {
        const existingSuccess = form.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Grazie! Ti contatteremo al più presto.</span>
        `;
        successDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: #ecfdf5;
            color: #059669;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-weight: 500;
        `;
        form.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    /**
     * Scroll Animations
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.service-card, .benefit-card, .process-step, .about-feature'
        );

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * Header scroll effect
     */
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    if (window.scrollY > 100) {
                        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                    } else {
                        header.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
                    }
                    lastScrollY = window.scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Lazy load images
     */
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        script.onload = function() {
            const observer = lozad();
            observer.observe();
        };
        document.body.appendChild(script);
    }

})();
