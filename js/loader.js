/**
 * Premium Odyssey Loader - v2.0
 * Handles the progress bar simulation and loading transition.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader-overlay');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loaderStatus = document.getElementById('loader-status');

    if (!loader || !progressBar || !progressText) return;

    let progress = 0;
    const statuses = [
        "Initializing engine...",
        "Loading assets...",
        "Optimizing performance...",
        "Finalizing environment...",
        "Experience ready!"
    ];

    function updateProgress() {
        // Randomly increment progress
        const increment = Math.random() * 15 + 5;
        progress += increment;

        if (progress > 100) progress = 100;

        // Update UI
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Ready! ${Math.round(progress)}%`;

        // Update status text based on progress
        const statusIndex = Math.min(
            Math.floor((progress / 100) * statuses.length),
            statuses.length - 1
        );
        loaderStatus.textContent = statuses[statusIndex];

        if (progress < 100) {
            // Random delay for simulation
            const delay = Math.random() * 300 + 200;
            setTimeout(updateProgress, delay);
        } else {
            // Once complete, wait a bit then fade out
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.style.overflow = 'auto'; // Re-enable scrolling

                // Remove loader from DOM after animation
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 1000);
        }
    }

    // Start loading process
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    setTimeout(updateProgress, 500);
});
