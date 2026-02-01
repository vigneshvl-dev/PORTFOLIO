// Brainova AI Chat App - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const messagesContainer = document.getElementById('messages-container');
    const typingIndicator = document.getElementById('typing-indicator');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const featureCards = document.querySelectorAll('.feature-card');

    // File Upload Elements
    const attachBtn = document.getElementById('attach-btn');
    const fileUpload = document.getElementById('file-upload');
    const filePreview = document.getElementById('file-preview');
    const fileNameDisplay = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file-btn');

    // API Modal Elements
    const apiModal = document.getElementById('api-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key');

    // Storage Keys
    const AUTH_USER_STORAGE = 'brainova_user';
    const CHAT_HISTORY_STORAGE = 'brainova_chat_history';

    // IMPORTANT: Hardcoded API Key for one-click experience
    // Note: In a production app, this should be handled by a backend
    const SERVICE_API_KEY = 'GOOGLE_AI_STUDIO_API_KEY'; // Replace with your actual key

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "your-app.firebaseapp.com",
        projectId: "your-app",
        storageBucket: "your-app.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // Brainova System Prompt
    const SYSTEM_PROMPT = `You are Brainova, an advanced AI study assistant designed especially for college students.

Your mission is to help students understand subjects deeply, complete projects, prepare for exams, and improve skills — not just give answers.

IDENTITY:
- Name: Brainova
- Role: AI Study Partner for College Students
- Personality: Smart, supportive, patient, and clear
- Teaching style: Like a friendly professor + skilled mentor

CORE GOALS:
- Make learning easier and faster
- Explain concepts clearly
- Guide students step-by-step
- Encourage understanding instead of memorization

STUDENT SUPPORT MODE:

When answering questions:
1. First understand what the student is trying to learn.
2. Adjust explanation based on difficulty (basic → advanced).
3. Use simple language unless technical depth is requested.
4. Break complex topics into small parts.
5. Use examples, diagrams (described), or analogies when helpful.

TEACHING RULES:
- Explain both "HOW" and "WHY".
- If the topic is theoretical, keep it exam-friendly.
- Highlight key points and definitions.
- Summarize at the end for revision.
- If the student seems confused, simplify further.

PROJECT ASSISTANCE MODE:

When helping with projects:
- First explain the project idea.
- Then provide step-by-step implementation.
- Suggest tools, technologies, and libraries.
- Provide sample code if needed.
- Suggest extra features to make the project stand out.
- Mention real-world use cases.

CODING HELP MODE:
- Provide clean and working code.
- Use beginner-friendly structure.
- Add short comments in code.
- Explain the logic after code.
- Mention common errors and fixes.

EXAM PREPARATION MODE:
- Give short and structured answers.
- Use bullet points.
- Highlight keywords.
- Focus on clarity and scoring-friendly content.

PROBLEM SOLVING APPROACH:
1. Understand the problem
2. Identify requirements
3. Provide solution steps
4. Show example
5. Mention mistakes to avoid

INTERACTION STYLE:
- Be polite and motivating.
- Encourage curiosity and learning.
- Never insult or discourage.
- Do not be overly casual or robotic.

ACADEMIC INTEGRITY:
- Do not promote cheating.
- Help students learn how to solve problems.
- Provide guidance, not direct exam cheating answers.

ADVANCED SMART FEATURES BEHAVIOR:

If user asks for comparison:
- Use table format

If user asks "explain simply":
- Use analogies and very basic terms

If user asks "in detail":
- Give deeper technical explanation

OUTPUT FORMAT:
- Use headings for big topics
- Use steps for processes
- Use bullets for lists
- Keep answers organized and readable
- Use markdown formatting for better readability

MAIN OBJECTIVE:
Brainova exists to make students smarter, more confident, and better at understanding their subjects.`;

    // Chat history for context
    let chatHistory = [];
    let attachedFile = null;

    // Initialize
    init();

    function init() {
        // Monitor Auth State
        auth.onAuthStateChanged(user => {
            if (user) {
                hideApiModal();
                updateUserUI(user);
            } else {
                showApiModal();
            }
        });

        // Load chat history
        loadChatHistory();

        // Setup event listeners
        setupEventListeners();

        // Auto-resize textarea
        setupTextareaAutoResize();
    }

    function updateUserUI(user) {
        const headerRight = document.querySelector('.header-right');
        let userMenu = document.getElementById('user-menu');

        if (!userMenu) {
            userMenu = document.createElement('div');
            userMenu.id = 'user-menu';
            userMenu.className = 'user-menu';
            headerRight.insertBefore(userMenu, headerRight.firstChild);
        }

        userMenu.innerHTML = `
            <img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar" title="${user.displayName}">
            <button class="logout-btn" id="logout-btn" title="Logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            auth.signOut();
        });
    }

    function setupEventListeners() {
        // Send message
        sendBtn.addEventListener('click', handleSendMessage);

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // File Upload
        attachBtn.addEventListener('click', () => fileUpload.click());
        fileUpload.addEventListener('change', handleFileSelect);
        removeFileBtn.addEventListener('click', removeAttachedFile);

        // New chat
        newChatBtn.addEventListener('click', startNewChat);

        // Feature cards
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.dataset.prompt;
                if (prompt) {
                    userInput.value = prompt;
                    handleSendMessage();
                }
            });
        });

        // Google Login
        const googleLoginBtn = document.getElementById('google-login-btn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => {
                auth.signInWithPopup(googleProvider).catch(error => {
                    console.error("Login Error:", error);
                    alert("Authentication failed: " + error.message);
                });
            });
        }
    }

    function setupTextareaAutoResize() {
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
        });
    }

    function showApiModal() {
        apiModal.classList.add('active');
    }

    function hideApiModal() {
        apiModal.classList.remove('active');
    }

    function loadChatHistory() {
        const saved = sessionStorage.getItem(CHAT_HISTORY_STORAGE);
        if (saved) {
            chatHistory = JSON.parse(saved);
            if (chatHistory.length > 0) {
                showChatView();
                chatHistory.forEach(msg => {
                    displayMessage(msg.role === 'user' ? 'user' : 'bot', msg.content, false);
                });
            }
        }
    }

    function saveChatHistory() {
        sessionStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(chatHistory));
    }

    function startNewChat() {
        chatHistory = [];
        sessionStorage.removeItem(CHAT_HISTORY_STORAGE);
        messagesContainer.innerHTML = '';
        showWelcomeScreen();
        userInput.value = '';
        userInput.style.height = 'auto';
        userInput.focus();
    }

    function showWelcomeScreen() {
        welcomeScreen.classList.remove('hidden');
        messagesContainer.classList.remove('active');
    }

    function showChatView() {
        welcomeScreen.classList.add('hidden');
        messagesContainer.classList.add('active');
    }

    function displayMessage(sender, content, animate = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatarIcon = sender === 'bot' ? 'fa-brain' : 'fa-user';

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="message-content">
                ${sender === 'bot' ? marked.parse(content) : escapeHtml(content)}
            </div>
        `;

        if (!animate) {
            messageDiv.style.animation = 'none';
        }

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    function showTyping() {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }

    function hideTyping() {
        typingIndicator.classList.remove('active');
    }

    function scrollToBottom() {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check size (Max 15MB)
        if (file.size > 15 * 1024 * 1024) {
            alert('File is too large. Please select a file under 15MB.');
            fileUpload.value = '';
            return;
        }

        attachedFile = file;
        fileNameDisplay.textContent = file.name;
        filePreview.style.display = 'flex';

        // Change icon based on type
        const icon = filePreview.querySelector('.file-info i');
        if (file.type.startsWith('image/')) {
            icon.className = 'fas fa-file-image';
        } else if (file.type === 'application/pdf') {
            icon.className = 'fas fa-file-pdf';
        } else {
            icon.className = 'fas fa-file-alt';
        }
    }

    function removeAttachedFile() {
        attachedFile = null;
        fileUpload.value = '';
        filePreview.style.display = 'none';
    }

    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message && !attachedFile) return;

        // Check if logged in
        if (!auth.currentUser) {
            showApiModal();
            return;
        }

        const apiKey = SERVICE_API_KEY; // Use hardcoded service key
        if (apiKey === 'GOOGLE_AI_STUDIO_API_KEY') {
            alert("Error: Admin has not configured the API Key yet.");
            return;
        }

        // Show chat view if on welcome screen
        showChatView();

        // Prepare what to display
        let displayContent = message;
        if (attachedFile) {
            displayContent += `\n\n*[Attached File: ${attachedFile.name}]*`;
        }

        // Display user message
        displayMessage('user', displayContent);

        // Capture data before clearing
        const currentMessage = message;
        const currentFile = attachedFile;

        userInput.value = '';
        userInput.style.height = 'auto';
        removeAttachedFile();

        // DON'T add to history yet to keep roles alternating in API call

        showTyping();
        sendBtn.disabled = true;

        try {
            const response = await sendToGemini(currentMessage, apiKey, currentFile);
            hideTyping();
            displayMessage('bot', response);

            // Add user message AND bot response to history at the same time
            chatHistory.push({ role: 'user', content: displayContent });
            chatHistory.push({ role: 'model', content: response });
            saveChatHistory();
        } catch (error) {
            hideTyping();
            console.error('Error:', error);

            let errorMessage = "I'm sorry, I encountered an error. ";
            if (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403')) {
                errorMessage = "❌ **Brainova Service Error.** The API configuration is incorrect. Please contact the administrator.";
            } else if (error.message.includes('safety')) {
                errorMessage = "⚠️ This content was blocked by safety filters.";
            } else if (error.message.includes('quota') || error.message.includes('exhausted') || error.message.includes('429')) {
                errorMessage = "⏳ **Rate limit exceeded.**\n\nYou've reached the free limit for the Gemini API (usually 15 messages/min). \n\n**Please wait 1 minute and refresh the page to continue.**";
            } else {
                errorMessage += `\n\n*Error details: ${error.message}*`;
            }

            displayMessage('bot', errorMessage);
        }

        sendBtn.disabled = false;
        userInput.focus();
    }

    async function sendToGemini(message, apiKey, file) {
        // Using 1.5 Flash for better stability in beta regions
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // 1. Clean and Prepare History (alternating user/model)
        const contents = [];
        let lastRole = null;

        // Add history turns (last 10)
        chatHistory.slice(-10).forEach(msg => {
            const role = msg.role === 'user' ? 'user' : 'model';
            // Only add if it alternates the role
            if (role !== lastRole) {
                contents.push({
                    role: role,
                    parts: [{ text: msg.content || "..." }]
                });
                lastRole = role;
            }
        });

        // Current turn MUST start with user and follow model
        if (contents.length > 0 && contents[0].role !== 'user') contents.shift();
        if (contents.length > 0 && contents[contents.length - 1].role !== 'model') contents.pop();

        // 2. Prepare Current Message
        const currentParts = [{ text: message || (file ? "Please analyze this file." : "Hello Brainova!") }];

        if (file) {
            const base64Data = await fileToBase64(file);
            currentParts.push({
                inline_data: {
                    mime_type: file.type,
                    data: base64Data
                }
            });
        }

        contents.push({
            role: 'user',
            parts: currentParts
        });

        // 3. API Call
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        if (data.promptFeedback?.blockReason) {
            throw new Error('This content was blocked by safety filters.');
        }

        throw new Error('Something went wrong. Please try refreshing or clearing chat.');
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
});
