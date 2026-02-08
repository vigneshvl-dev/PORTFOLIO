/**
 * Modern Tech Loader - v5.0
 * Handles progress simulation, particle background, 
 * floating symbols, and typing text effect.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader-overlay');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const typingText = document.getElementById('typing-text');
    const symbolsContainer = document.getElementById('symbols-container');
    const particleCanvas = document.getElementById('particle-canvas');

    if (!loader || !progressBar) return;

    // --- Particle System ---
    let particles = [];
    const ctx = particleCanvas ? createCanvas() : null;

    function createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        particleCanvas.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();
        return ctx;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > window.innerWidth) this.x = 0;
            else if (this.x < 0) this.x = window.innerWidth;

            if (this.y > window.innerHeight) this.y = 0;
            else if (this.y < 0) this.y = window.innerHeight;
        }

        draw() {
            if (!ctx) return;
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    // --- Configuration ---
    const statusMessages = [
        "Initializing Systems...",
        "Loading Portfolio Data...",
        "Connecting to Neural Network...",
        "Optimizing UI Components...",
        "Preparing Experience...",
        "System Ready."
    ];
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const symbols = ['< />', '{ }', '0 1', '[ ]', '( )', '=>', '*/', '&&', '||'];
    const symbolCount = 20;

    // --- Floating Symbols ---
    function createSymbols() {
        for (let i = 0; i < symbolCount; i++) {
            const span = document.createElement('span');
            span.className = 'symbol';
            span.innerText = symbols[Math.floor(Math.random() * symbols.length)];

            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 20;

            span.style.left = `${left}%`;
            span.style.setProperty('--duration', `${duration}s`);
            span.style.animationDelay = `-${delay}s`;

            symbolsContainer.appendChild(span);
        }
    }

    // --- Typing Effect ---
    function typeEffect() {
        const currentMessage = statusMessages[messageIndex];

        if (isDeleting) {
            typingText.innerText = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.innerText = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentMessage.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % statusMessages.length;
            typingSpeed = 500; // Pause before new message
        }

        // Stop cycling if loading is done and we reached "System Ready"
        if (progress >= 100 && currentMessage === "System Ready." && charIndex === currentMessage.length) {
            return;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // --- Progress Simulation ---
    let progress = 0;
    function updateProgress() {
        const increment = Math.random() * 3 + 0.5;
        progress += increment;

        if (progress > 100) progress = 100;

        progressBar.style.width = `${progress}%`;
        progressPercent.innerText = `${Math.floor(progress)}%`;

        if (progress < 100) {
            const delay = Math.random() * 150 + 50;
            setTimeout(updateProgress, delay);
        } else {
            completeLoading();
        }
    }

    function completeLoading() {
        // Change text to final message
        messageIndex = statusMessages.length - 1;
        isDeleting = false;
        charIndex = 12; // "System Ready."
        typingText.innerText = "System Ready.";

        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.style.overflow = 'auto';

            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 1200);
    }

    // --- Initialization ---
    document.body.style.overflow = 'hidden';
    createSymbols();
    initParticles();
    animateParticles();
    typeEffect();
    setTimeout(updateProgress, 500);
});


