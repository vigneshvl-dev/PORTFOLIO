document.addEventListener('DOMContentLoaded', () => {
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    // Toggle Chat Window
    chatbotButton.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        if (chatbotWidget.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    // Handle Sending Messages
    const sendMessage = () => {
        const text = chatbotInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        chatbotInput.value = '';

        // Bot thinking
        showTyping(true);

        setTimeout(() => {
            const response = getBotResponse(text);
            showTyping(false);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    };

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const showTyping = (show) => {
        typingIndicator.style.display = show ? 'flex' : 'none';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const getBotResponse = (input) => {
        const query = input.toLowerCase();

        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! I'm <b>Viky AI</b>. How can I help you explore Vignesh's work today? 👋";
        }
        if (query.includes('who is vignesh') || query.includes('about')) {
            return "Vignesh is a passionate Computer Science student and an aspiring Full-Stack Developer. He's currently in his 2nd Semester at Stella Mary's College of Engineering!";
        }
        if (query.includes('game') || query.includes('projects')) {
            return "Vignesh has built some cool games! You should check out <b>Brick Breaker</b> and <b>Memory Match</b> in the projects section. 🎮";
        }
        if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
            return "You can reach Vignesh at <a href='mailto:vigneshvelappan73051@gmail.com' style='color:#06b6d4'>vigneshvelappan73051@gmail.com</a> or use the contact form below!";
        }
        if (query.includes('skill') || query.includes('tech')) {
            return "He specializes in HTML, CSS, JavaScript, and Python. He's currently exploring UI/UX design with Figma too!";
        }
        if (query.includes('twitter') || query.includes('x')) {
            return "You can follow Vignesh on X (Twitter) here: <a href='https://x.com/vikyvelappan' target='_blank' style='color:#06b6d4'>@vikyvelappan</a>";
        }

        return "That's interesting! I'm still learning, but I can tell you about Vignesh's projects, skills, or how to contact him. What would you like to know?";
    };
});
