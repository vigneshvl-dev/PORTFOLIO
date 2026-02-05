/**
 * Roblox-Style Loader - v3.0
 * Handles the asset loading simulation and progress.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader-overlay');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const assetsCount = document.getElementById('assets-count');

    if (!loader || !progressBar || !progressText || !assetsCount) return;

    let progress = 0;
    const totalAssets = 100;

    function updateProgress() {
        // Randomly increment progress
        const increment = Math.random() * 10 + 2;
        progress += increment;

        if (progress > 100) progress = 100;

        // Update UI
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Loading... ${Math.round(progress)}%`;

        // Simulating asset count based on progress
        const currentAssets = Math.floor((progress / 100) * totalAssets);
        assetsCount.textContent = `Loaded ${currentAssets} / ${totalAssets} Assets`;

        if (progress < 100) {
            const delay = Math.random() * 200 + 100;
            setTimeout(updateProgress, delay);
        } else {
            // Once complete, wait a bit then fade out
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.style.overflow = 'auto';

                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 1000);
        }
    }

    // Start loading process
    document.body.style.overflow = 'hidden';
    setTimeout(updateProgress, 500);
});
