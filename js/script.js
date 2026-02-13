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
    const revealElements = document.querySelectorAll('.section-header, .about-content, .skills-grid, .services-grid, .projects-grid, .certificates-grid, .contact-wrapper, .hero-content, .hero-image-wrapper, .stat-card, #stats .section-header');

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

    // Fetch Stats
    const fetchStats = async () => {
        // Fetch GitHub Repos
        try {
            const githubRes = await fetch('https://api.github.com/users/vigneshvl-dev');
            const githubData = await githubRes.json();
            if (githubData.public_repos !== undefined) {
                document.getElementById('github-repo-count').innerText = githubData.public_repos;
            }
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            document.getElementById('github-repo-count').innerText = '15+'; // Fallback
        }

        // Fetch LeetCode Solved (Unofficial API Wrapper)
        try {
            // Using a common public API wrapper for LeetCode stats
            const leetcodeRes = await fetch('https://leetcode-stats-api.herokuapp.com/vigneshvl');
            const leetcodeData = await leetcodeRes.json();
            if (leetcodeData.status === 'success' && leetcodeData.totalSolved !== undefined) {
                document.getElementById('leetcode-solved-count').innerText = leetcodeData.totalSolved;
            } else {
                document.getElementById('leetcode-solved-count').innerText = '50+'; // Fallback
            }
        } catch (error) {
            console.error('Error fetching LeetCode stats:', error);
            document.getElementById('leetcode-solved-count').innerText = '50+'; // Fallback
        }
    };

    fetchStats();

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
