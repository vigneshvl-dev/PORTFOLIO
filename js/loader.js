/**
 * DevOps Terminal Loader - v1.0
 * Handles the typing animation and auto-hide logic for the loading screen.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('terminal-loader');
    const terminalBody = document.getElementById('terminal-body');

    if (!loader || !terminalBody) return;

    const messages = [
        "Loading..."
    ];

    let messageIndex = 0;

    function typeMessage(message, index, callback) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = '<span class="prompt">></span> <span class="text"></span>';
        terminalBody.appendChild(line);

        const textSpan = line.querySelector('.text');
        let charIndex = 0;

        function typeChar() {
            if (charIndex < message.length) {
                textSpan.textContent += message.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 30); // Speed of typing
            } else {
                // Done typing this line
                if (callback) callback();
            }
        }

        typeChar();
    }

    function processNextMessage() {
        if (messageIndex < messages.length) {
            typeMessage(messages[messageIndex], 0, () => {
                messageIndex++;
                setTimeout(processNextMessage, 400); // Delay between lines
            });
        } else {
            // All messages typed, add blinking cursor
            const cursorLine = document.createElement('div');
            cursorLine.className = 'terminal-line';
            cursorLine.innerHTML = '<span class="prompt">></span> <span class="cursor">_</span>';
            terminalBody.appendChild(cursorLine);

            // Wait 2 seconds then fade out
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.style.overflow = 'auto'; // Re-enable scrolling

                // Remove loader from DOM after animation
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 2000);
        }
    }

    // Start the animation
    document.body.style.overflow = 'hidden'; // Prevent scrolling during loading
    setTimeout(processNextMessage, 500);
});
