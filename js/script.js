// Main Script
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.section-header, .about-content, .skills-grid, .services-grid, .projects-grid, .contact-wrapper, .hero-content, .hero-image-wrapper');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Typewriter Effect for Hero Subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.innerText;
        heroSubtitle.innerHTML = '';
        heroSubtitle.style.opacity = '1';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                if (text.charAt(i) === '|') {
                    heroSubtitle.innerHTML += '<span class="divider">|</span>';
                } else {
                    heroSubtitle.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typewriter after a short delay
        setTimeout(typeWriter, 1000);
    }
});
