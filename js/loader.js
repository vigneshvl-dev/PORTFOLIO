/**
 * Sci-Fi HUD Loader - v4.0
 * Handles the linear progress simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader-overlay');
    const progressBar = document.getElementById('progress-bar');

    if (!loader || !progressBar) return;

    let progress = 0;

    function updateProgress() {
        // Increment progress (faster for this style)
        const increment = Math.random() * 5 + 1;
        progress += increment;

        if (progress > 100) progress = 100;

        // Update UI
        progressBar.style.width = `${progress}%`;

        if (progress < 100) {
            const delay = Math.random() * 100 + 50;
            setTimeout(updateProgress, delay);
        } else {
            // Once complete, wait a bit then fade out
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.style.overflow = 'auto';

                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 800);
        }
    }

    // Start loading process
    document.body.style.overflow = 'hidden';
    setTimeout(updateProgress, 300);
});
