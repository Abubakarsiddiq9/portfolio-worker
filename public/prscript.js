(() => {
const currentScript = document.currentScript;
const siteRoot = currentScript ? new URL(".", currentScript.src) : new URL("./", window.location.href);
const assetPath = (path) => new URL(path, siteRoot).href;

const CHAT_URL = `/api/chat`;

// ── THEME TOGGLE ───────────────────────────────────────────
const themeButtons = document.querySelectorAll(".theme-toggle, .mobile-theme-toggle");
const themeIcons   = document.querySelectorAll(".theme-toggle img, .mobile-theme-toggle img");
const heroImage    = document.querySelector("#heroImage");

function setTheme(isDarkMode) {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("portfolio-theme", isDarkMode ? "dark" : "light");
    themeIcons.forEach((icon) => {
        icon.src = isDarkMode
            ? assetPath("imgs/light-svgrepo-com (1).svg")
            : assetPath("imgs/light-svgrepo-com.svg");
    });
    if (heroImage) {
        heroImage.src = isDarkMode ? assetPath("imgs/boydrk.png") : assetPath("imgs/boy-draw.jpg");
    }
}

if (themeButtons.length) {
    setTheme(localStorage.getItem("portfolio-theme") === "dark");
    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setTheme(!document.body.classList.contains("dark-mode"));
        });
    });
}

// ── PREDEFINED FALLBACK Q&A ───────────────────────────────────
const qaData = [
    {
        keywords: ["skill", "skills", "know", "tech", "technologies", "stack", "use", "tools"],
        answer: "My tech stack includes:\n- HTML, CSS, JavaScript\n- Python\n- Node.js & Express.js\n- PostgreSQL\n- Git & GitHub\n- Figma & VS Code"
    },
    {
        keywords: ["assalamualaikum", "aslm", "assalamu alaikum", "salam", "assalam", "salaam"],
        answer: "Wa Alaikum Assalam! I'm Abubakar's portfolio assistant. Feel free to ask me about his skills, projects, education, or contact information."
    },
    {
        keywords: ["study", "studying", "education", "college", "university", "iit", "degree", "course", "data science", "current", "doing", "pursuing"],
        answer: "I am currently pursuing a BS in Data Science at IIT Madras, where I am building strong foundations in statistics, programming, and modern application development."
    },
    {
        keywords: ["name", "who are you", "who is", "abubakar", "introduce", "yourself", "about"],
        answer: "I am Mohammed Abubakar Siddiq, a Data Science student at IIT Madras and an aspiring Software Engineer based in Khammam, Telangana."
    },
    {
        keywords: ["project", "projects", "built", "made", "created", "work", "portfolio"],
        answer: "I have built projects including this portfolio, a calculator, a clock app, a todo app, and an Islamic learning platform. The Projects page has the full showcase."
    },
    {
        keywords: ["contact", "reach", "email", "phone", "whatsapp", "hire", "connect"],
        answer: "You can contact me through the Contact page, or email me at: abubakarsiddiqmohiuddin@gmail.com"
    },
    {
        keywords: ["age", "old", "born", "year"],
        answer: "I'm 18 years old."
    },
    {
        keywords: ["location", "city", "state", "where", "based", "live", "from"],
        answer: "I am based in Khammam, Telangana, India."
    },
    {
        keywords: ["goal", "goals", "dream", "aspire", "future", "plan", "ambition"],
        answer: "My goal is to become a skilled Software Engineer and contribute to building innovative, scalable, and impactful software that solves real-world problems."
    },
    {
        keywords: ["language", "languages", "programming", "code", "coding"],
        answer: "I primarily develop using Python and JavaScript. For a complete overview, visit the 'What I Use' section on the home page."
    },
    {
        keywords: ["hello", "hi", "hey", "greet", "good morning", "good afternoon", "howdy", "sup", "what's up", "whats up"],
        answer: "Hey! I'm Abubakar's portfolio assistant. Feel free to ask me about his skills, projects, education, or contact information."
    },
    {
        keywords: ["bye", "goodbye", "see you", "later", "cya"],
        answer: "Goodbye! Feel free to come back anytime, and do check out the Projects page."
    },
    {
        keywords: ["thanks", "thank you", "thx", "appreciate"],
        answer: "You are welcome. What else would you like to know?"
    },
    {
        keywords: ["qualifications", "marks", "grades", "10th", "schooling", "school", "inter", "intermediate", "secondary"],
        answer: "Abubakar completed his 10th at Oxford School Khammam (GPA 9.2/10) and Intermediate at Sri Chaitanya Junior College (92.3%). He is currently pursuing a BS in Data Science from IIT Madras."
    }
];

const fallbackReplies = [
    "I'm not sure about that right now. Try asking about skills, projects, education, or contact info.",
    "I don't have an answer for that one. Ask me about Abubakar's tech stack or projects.",
    "Try asking: 'What are your skills?' or 'How can I contact you?'",
    "I'm running in basic mode right now. Try asking about skills, education, or projects."
];

function getPreDefinedAnswer(input) {
    const lower = input.toLowerCase().trim();
    if (!lower) return null;
    for (const entry of qaData) {
        if (entry.keywords.some((kw) => lower.includes(kw))) {
            return entry.answer;
        }
    }
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

// ── BACKEND CALL ──────────────────────────────────────────────
// Restore conversation history from sessionStorage (survives page navigation)
const conversationHistory = JSON.parse(sessionStorage.getItem("cb_history") || "[]");

function saveHistory() {
    sessionStorage.setItem("cb_history", JSON.stringify(conversationHistory));
}

async function askGemini(userMessage) {
    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });
    saveHistory();

    const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: conversationHistory })
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 429) throw new Error("RATE_LIMIT");
        throw new Error(data?.message || `HTTP ${response.status}`);
    }

    const reply = data.reply;

    conversationHistory.push({
        role: "model",
        parts: [{ text: reply }]
    });
    saveHistory();

    return reply;
}

// Admin Login uIII
const adminBtn =
    document.getElementById("adminBtn");

const adminModal =
    document.getElementById("adminModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

if (adminBtn) {
    adminBtn.addEventListener("click", () => {
        adminModal.style.display = "block";
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        adminModal.style.display = "none";
    });
}


const loginBtn =
    document.getElementById("loginBtn");

const adminPassword =
    document.getElementById("adminPassword");

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {

        try {
            const response = await fetch(
                "/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        password: adminPassword.value
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                alert("Invalid password");
                return;
            }

            window.location.href =
                "/Admin/guestbook.html";

        } catch (err) {
            console.error(err);
            alert("Login failed");
        }

    });
}







// ── CHATBOT UI ────────────────────────────────────────────────
function setupChatbot() {
    if (document.getElementById("chatbot-overlay")) return;

    const chatHTML = `
        <button class="convimg" type="button" aria-label="Open portfolio chatbot">
            <img src="${assetPath("imgs/conversation-svgrepo-com (1).svg")}" alt="">
        </button>
        <div id="chatbot-overlay" class="cb-overlay" aria-hidden="true">
            <div class="cb-window" role="dialog" aria-label="Portfolio chatbot">
                <div class="cb-header">
                    <div class="cb-header-info">
                        <div class="cb-avatar">A</div>
                        <div>
                            <p class="cb-title">Abubakar's Bot</p>
                            <p class="cb-status"><span class="cb-dot"></span>Online</p>
                        </div>
                    </div>
                    <button class="cb-close" type="button" aria-label="Close chat">✕</button>
                </div>
                <div class="cb-messages" id="cb-messages">
                    <div class="cb-msg bot">
                        <span>Hey! 👋 I'm Abubakar's portfolio assistant. Ask me anything — skills, education, projects, or how to get in touch!</span>
                    </div>
                </div>
                <div class="cb-suggestions" id="cb-suggestions">
                    <button class="cb-chip" type="button">Skills</button>
                    <button class="cb-chip" type="button">Education</button>
                    <button class="cb-chip" type="button">Projects</button>
                    <button class="cb-chip" type="button">Contact</button>
                </div>
                <div class="cb-input-row">
                    <input id="cb-input" type="text" placeholder="Type a message..." autocomplete="off" maxlength="300">
                    <button id="cb-send" type="button" aria-label="Send">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", chatHTML);

    // ── RESTORE UI MESSAGES from sessionStorage ───────────────
    // Runs once on page load — rebuilds chat bubbles from saved session
    function restoreMessages() {
        const saved = JSON.parse(sessionStorage.getItem("cb_ui_messages") || "[]");
        const restoredDivider = sessionStorage.getItem("cb_divider");
        const messagesEl = document.getElementById("cb-messages");

        saved.forEach(({ text, sender, isDivider }) => {
            if (isDivider) {
                const div = document.createElement("div");
                div.className = "cb-divider";
                div.textContent = text;
                messagesEl.appendChild(div);
            } else {
                const div = document.createElement("div");
                div.className = `cb-msg ${sender}`;
                div.textContent = text;
                messagesEl.appendChild(div);
            }
        });

        if (saved.length > 0) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }

    function saveUIMessages() {
        const messagesEl = document.getElementById("cb-messages");
        const msgs = [];
        messagesEl.querySelectorAll(".cb-msg, .cb-divider").forEach((el) => {
            if (el.classList.contains("cb-divider")) {
                msgs.push({ text: el.textContent, isDivider: true });
            } else {
                const sender = el.classList.contains("user") ? "user" : "bot";
                msgs.push({ text: el.textContent, sender, isDivider: false });
            }
        });
        // Skip the default welcome message (always first, always present)
        sessionStorage.setItem("cb_ui_messages", JSON.stringify(msgs.slice(1)));
    }

    const overlay    = document.getElementById("chatbot-overlay");
    const convBtn    = document.querySelector(".convimg");
    const closeBtn   = document.querySelector(".cb-close");
    const messagesEl = document.getElementById("cb-messages");
    const input      = document.getElementById("cb-input");
    const sendBtn    = document.getElementById("cb-send");
    const chips      = document.querySelectorAll(".cb-chip");

    function openChat() {
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        input.focus();
    }
    function closeChat() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
    }

    // Divider shown once when AI goes offline
    let dividerShown = false;
    function appendDivider(text) {
        if (dividerShown) return;
        dividerShown = true;
        const div = document.createElement("div");
        div.className = "cb-divider";
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveUIMessages();
    }

    function appendMessage(text, sender) {
        const div = document.createElement("div");
        div.className = `cb-msg ${sender}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveUIMessages();
        return div;
    }

    function showTyping() {
        const div = document.createElement("div");
        div.className = "cb-typing";
        div.id = "cb-typing-indicator";
        div.innerHTML = "<span></span><span></span><span></span>";
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    function removeTyping() {
        const t = document.getElementById("cb-typing-indicator");
        if (t) t.remove();
    }

    function setInputDisabled(disabled) {
        input.disabled = disabled;
        sendBtn.disabled = disabled;
        sendBtn.style.opacity = disabled ? "0.5" : "1";
    }

    // ── CLIENT-SIDE RATE TRACKING ────────────────────────────────
    // Tracks how many messages used within current 1hr window
    // Uses localStorage so count persists across page navigations & reloads
    // But server is still the real enforcer — this just syncs UI state
    const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms
    const RATE_MAX = 20;

    function getRateData() {
        try {
            return JSON.parse(localStorage.getItem("cb_rate") || "{}");
        } catch { return {}; }
    }
    function saveRateData(data) {
        localStorage.setItem("cb_rate", JSON.stringify(data));
    }
    function incrementRateCount() {
        const now = Date.now();
        const data = getRateData();
        // Reset if window has expired
        if (!data.windowStart || now - data.windowStart > RATE_WINDOW) {
            saveRateData({ windowStart: now, count: 1 });
            return 1;
        }
        data.count = (data.count || 0) + 1;
        saveRateData(data);
        return data.count;
    }
    function getRemainingMessages() {
        const now = Date.now();
        const data = getRateData();
        if (!data.windowStart || now - data.windowStart > RATE_WINDOW) return RATE_MAX;
        return Math.max(0, RATE_MAX - (data.count || 0));
    }

    // Start in rate-limited mode if already exhausted from a previous visit
    let rateLimited = getRemainingMessages() === 0;

    async function sendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        appendMessage(trimmed, "user");
        input.value = "";

        // If already rate limited, skip API call entirely — no tokens used
        if (rateLimited) {
            setTimeout(() => {
                appendMessage(getPreDefinedAnswer(trimmed), "bot");
            }, 400);
            return;
        }

        setInputDisabled(true);
        showTyping();

        try {
            const reply = await askGemini(trimmed);
            removeTyping();
            appendMessage(reply, "bot");
            // Increment client-side counter after successful AI reply
            incrementRateCount();

        } catch (err) {
            removeTyping();

            if (err.message === "RATE_LIMIT") {
                rateLimited = true;
                // Mark as fully used in localStorage so next visit knows
                saveRateData({ windowStart: Date.now(), count: RATE_MAX });
                appendDivider("⏳ AI limit reached — basic mode active. Come back in an hour for full AI responses.");
            } else {
                appendDivider("⚡ AI temporarily unavailable — switching to basic mode.");
            }

            appendMessage(getPreDefinedAnswer(trimmed), "bot");
            console.error("Chat error:", err.message);

        } finally {
            setInputDisabled(false);
            input.focus();
        }
    }

    // Restore UI on load
    restoreMessages();
    // If already rate limited coming into this page, mark divider as shown
    // so it doesn't show again on top of restored messages
    if (rateLimited) dividerShown = true;

    convBtn.addEventListener("click", () => {
        overlay.classList.contains("open") ? closeChat() : openChat();
    });
    closeBtn.addEventListener("click", closeChat);
    document.addEventListener("click", (e) => {
        if (overlay.classList.contains("open") &&
            !overlay.contains(e.target) &&
            !convBtn.contains(e.target)) {
            closeChat();
        }
    });

    sendBtn.addEventListener("click", () => sendMessage(input.value));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) sendMessage(input.value);
    });
    chips.forEach((chip) => {
        chip.addEventListener("click", () => sendMessage(chip.textContent));
    });
}

setupChatbot();
})();