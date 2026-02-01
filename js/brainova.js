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
    const API_KEY_STORAGE = 'brainova_api_key';
    const CHAT_HISTORY_STORAGE = 'brainova_chat_history';

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
        // Check for API key
        const savedApiKey = localStorage.getItem(API_KEY_STORAGE);
        if (!savedApiKey) {
            showApiModal();
        } else {
            hideApiModal();
        }

        // Load chat history
        loadChatHistory();

        // Setup event listeners
        setupEventListeners();

        // Auto-resize textarea
        setupTextareaAutoResize();
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

        // Save API key
        saveApiKeyBtn.addEventListener('click', saveApiKey);

        apiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveApiKey();
            }
        });
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

    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('Please enter a valid API key');
            return;
        }
        localStorage.setItem(API_KEY_STORAGE, apiKey);
        hideApiModal();
        userInput.focus();
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

        const apiKey = localStorage.getItem(API_KEY_STORAGE);
        if (!apiKey) {
            showApiModal();
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
            if (error.message.includes('API key')) {
                errorMessage = "❌ **Invalid API Key.** Please check your key or [get a new one](https://aistudio.google.com/app/apikey).";
                localStorage.removeItem(API_KEY_STORAGE);
                setTimeout(showApiModal, 2000);
            } else if (error.message.includes('safety')) {
                errorMessage = "⚠️ This content was blocked by safety filters.";
            } else if (error.message.includes('quota')) {
                errorMessage = "⏳ Rate limit exceeded. Please try again in 1 minute.";
            } else {
                errorMessage += `\n\n*Error details: ${error.message}*`;
            }

            displayMessage('bot', errorMessage);
        }

        sendBtn.disabled = false;
        userInput.focus();
    }

    async function sendToGemini(message, apiKey, file) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        // Prepare history for Gemini API
        let contents = [];

        // Take the last 10 messages from session history
        let recentHistory = chatHistory.slice(-10);

        // Ensure history starts with 'user'
        while (recentHistory.length > 0 && recentHistory[0].role !== 'user') {
            recentHistory.shift();
        }

        // Map to Gemini format
        contents = recentHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content || "..." }]
        }));

        // Current message parts
        const currentParts = [];

        // Gemini MUST have text in a part, or it's invalid
        const textContent = message || (file ? "Analyzing this attachment..." : "Hello");
        currentParts.push({ text: textContent });

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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topP: 0.95,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 || response.status === 401 || response.status === 403) {
                throw new Error('Invalid API key');
            }
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        if (data.promptFeedback?.blockReason) {
            throw new Error('Blocked by safety filters');
        }

        throw new Error('Unexpected response format');
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
