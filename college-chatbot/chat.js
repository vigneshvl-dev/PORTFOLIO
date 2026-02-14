document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // College Data
    const collegeData = {
        details: "Campus D.esk is a premier institution known for academic excellence and innovation. Located in the heart of the city, we offer a vibrant campus life and world-class facilities.",
        courses: "We offer undergraduate and postgraduate programs in Engineering (CSE, EEE, ECE, Civil, Mechanical), Data Science, AI & ML, and Business Administration.",
        admissions: "Admissions for the 2026-27 session are now open! You can apply online through our portal or visit the college office for assistance.",
        fees: "Our fee structure is competitive and varies by course. Academic scholarships are available for deserving students. Please visit the office for a detailed fee breakdown.",
        facilities: "Our campus features state-of-the-art labs, a digital library, modern sports complexes, high-speed Wi-Fi, and premium hostel accommodations.",
        placements: "We have an exceptional placement record with 95%+ graduates placed in top MNCs like Google, Microsoft, Amazon, and TATA. Our average package is 8.5 LPA.",
        contact: "You can reach us at info@campusdesk.edu or call our office at +1 (555) 123-4567. We are open Mon-Sat, 9 AM to 5 PM."
    };

    // Toggle Chatbot Window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.style.display = chatbotWindow.style.display === 'flex' ? 'none' : 'flex';
        if (chatbotWindow.style.display === 'flex') {
            userInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });

    // Send Message Logic
    const sendMessage = () => {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';

        // Generate Bot Response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            appendMessage('bot', botResponse);
        }, 600);
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `${text}<div class="timestamp">${time}</div>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getBotResponse(input) {
        const query = input.toLowerCase();
        let response = "";

        if (query.includes('hello') || query.includes('hi')) {
            response = "Hello! I'm here to help you with information about Campus D.esk.";
        } else if (query.includes('course') || query.includes('program') || query.includes('study')) {
            response = collegeData.courses;
        } else if (query.includes('admission') || query.includes('apply')) {
            response = collegeData.admissions;
        } else if (query.includes('fee') || query.includes('cost') || query.includes('scholarship')) {
            response = collegeData.fees;
        } else if (query.includes('facility') || query.includes('hostel') || query.includes('campus') || query.includes('lab')) {
            response = collegeData.facilities;
        } else if (query.includes('placement') || query.includes('job') || query.includes('salary') || query.includes('recruit')) {
            response = collegeData.placements;
        } else if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('address') || query.includes('location')) {
            response = collegeData.contact;
        } else if (query.includes('about') || query.includes('college') || query.includes('campus')) {
            response = collegeData.details;
        } else {
            response = "Sorry, I don’t have that information. Please contact the college office.";
        }

        return `${response}\n\nAnything else you’d like to know?`;
    }
});
