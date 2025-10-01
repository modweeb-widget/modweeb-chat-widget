function modweebChat(options) {
    const HUGGING_FACE_TOKEN = options.config.hfToken;
    const HUGGING_FACE_MODEL = options.config.hfModel;
    const USAGE_KEY = "modweebChatUsage_v1";
    const HISTORY_KEY = "modweebChatHistory_v1";
    const DEV_FLAG_KEY = "modweebDevUnlimited_v1";

    const WIDGET_HTML = `
        <button id="modweeb-chat-btn" type="button" class="modweeb-chat-btn" aria-label="فتح الدردشة" title="ابدأ دردشة AI">
            <svg class="modweeb-svg-btn-n" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.49 12C21.81 10.98 22 9.88 22 8.69C22 5.6 19.51 3.09998 16.44 3.09998C14.62 3.09998 13.01 3.98003 12 5.34003C10.99 3.98003 9.37 3.09998 7.56 3.09998C4.49 3.09998 2 5.6 2 8.69C2 15.69 8.48 19.82 11.38 20.82C11.55 20.88 11.77 20.91 12 20.91"></path>
                <path d="M19.21 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.82 15.13 19.21 15.74Z" stroke-miterlimit="10"></path>
                <path d="M18.7001 16.25C19.0001 17.33 19.8401 18.17 20.9201 18.47" stroke-miterlimit="10"></path>
            </svg>
        </button>
        <div id="modweeb-widget-container">
            <div id="modweeb-chat-container" role="dialog" aria-label="دردشة الذكاء الاصطناعي">
                <div id="modweeb-status" aria-live="polite"></div>
                <div class="modweeb-head" id="modweeb-head">
                    <span>
                        <svg class="line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.75 2.44995C11.45 1.85995 12.58 1.85995 13.26 2.44995L14.84 3.79995C15.14 4.04995 15.71 4.25995 16.11 4.25995H17.81C18.87 4.25995 19.74 5.12995 19.74 6.18995V7.88995C19.74 8.28995 19.95 8.84995 20.2 9.14995L21.55 10.7299C22.14 11.4299 22.14 12.5599 21.55 13.2399L20.2 14.8199C19.95 15.1199 19.74 15.6799 19.74 16.0799V17.7799C19.74 18.8399 18.87 19.7099 17.81 19.7099H16.11C15.71 19.7099 15.15 19.9199 14.85 20.1699L13.27 21.5199C12.57 22.1099 11.44 22.1099 10.76 21.5199L9.18001 20.1699C8.88001 19.9199 8.31 19.7099 7.92 19.7099H6.17C5.11 19.7099 4.24 18.8399 4.24 17.7799V16.0699C4.24 15.6799 4.04 15.1099 3.79 14.8199L2.44 13.2299C1.86 12.5399 1.86 11.4199 2.44 10.7299L3.79 9.13995C4.04 8.83995 4.24 8.27995 4.24 7.88995V6.19995C4.24 5.13995 5.11 4.26995 6.17 4.26995H7.9C8.3 4.26995 8.86 4.05995 9.16 3.80995L10.75 2.44995Z"></path>
                            <path d="M8.5 15.9401L12 8.06006L15.5 15.9401"></path>
                            <path d="M13.75 13.3101H10.25"></path>
                        </svg>
                        Gemma AI Chat
                    </span>
                    <div style="display:flex;align-items:center;gap:6px">
                        <div class="modweeb-usage" id="modweeb-usage">
                            <span id="modweeb-remaining">الرسائل المتبقية: --</span>
                            <span id="modweeb-chars">0 أحرف</span>
                        </div>
                        <button id="modweeb-chat-close" title="غلق">
                            <svg class="line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
                                <path d="M9.16998 14.83L14.83 9.17004"></path>
                                <path d="M14.83 14.83L9.16998 9.17004"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="modweeb-suggestions" aria-hidden="false">
                    <button class="modweeb-suggestion-btn">كيف أحسن سرعة مدونتي؟</button>
                    <button class="modweeb-suggestion-btn">ما أفضل إضافات SEO؟</button>
                    <button class="modweeb-suggestion-btn">كيف أزيد زوار مدونتي؟</button>
                    <button class="modweeb-suggestion-btn">نصائح لتحسين المحتوى</button>
                </div>
                <div id="modweeb-messages" aria-live="polite"></div>
                <div class="modweeb-input-wrap">
                    <textarea id="modweeb-input" rows="1" maxlength="300" placeholder="اكتب رسالتك هنا..." aria-label="محتوى الرسالة" style="background:var(--contentB,#fff)"></textarea>
                    <button id="modweeb-send" title="إرسال (Enter)">
                        <svg class="line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>
                            <path d="M10.11 13.6501L13.69 10.0601"></path>
                        </svg>
                    </button>
                </div>
                <div class="modweeb-actions">
                    <button id="modweeb-copy-all" title="نسخ المحادثة">
                        <svg class="line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22Z"></path>
                            <path d="M14.88 15C14.17 15.62 13.25 16 12.24 16C10.03 16 8.23999 14.21 8.23999 12C8.23999 9.79 10.03 8 12.24 8C13.25 8 14.17 8.38 14.88 9"></path>
                        </svg>
                    </button>
                    <button id="modweeb-clear" title="حذف المحادثة">
                        <svg class="line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
                            <path d="M9.16998 14.83L14.83 9.17004"></path>
                            <path d="M14.83 14.83L9.16998 9.17004"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = WIDGET_HTML;
    for (; tempDiv.firstChild;) document.body.appendChild(tempDiv.firstChild);

    const btn = document.getElementById("modweeb-chat-btn");
    const container = document.getElementById("modweeb-chat-container");
    const widgetContainer = document.getElementById("modweeb-widget-container");
    const messagesContainer = document.getElementById("modweeb-messages");
    const statusDiv = document.getElementById("modweeb-status");
    const inputArea = document.getElementById("modweeb-input");
    const sendBtn = document.getElementById("modweeb-send");
    const closeBtn = document.getElementById("modweeb-chat-close");
    const charsUI = document.getElementById("modweeb-chars");
    const head = document.getElementById("modweeb-head");
    const copyAllBtn = document.getElementById("modweeb-copy-all");
    const clearBtn = document.getElementById("modweeb-clear");
    const suggestions = document.querySelectorAll(".modweeb-suggestion-btn");

    function escapeHtml(text) {
        return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") : "";
    }

    function isSafeUrl(url) {
        try {
            let u = new URL(url, location.href);
            return "https:" === u.protocol || "http:" === u.protocol;
        } catch (n) {
            return !1;
        }
    }

    function renderRichText(text) {
        let escaped = escapeHtml(text);
        escaped = escaped.replace(/^#{1,6}\s+(.*)$/gm, (match, title) => 
            `<b style="display:block; margin:15px 0 8px 0; color:var(--linkC, #2563eb);">${title.trim()}</b>`
        );

        let listCounter = 0;
        escaped = escaped.replace(/^[*\-]\s+(.*)$/gm, (match, item) => {
            listCounter++;
            const arabicNumber = listCounter <= 10 ? ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"][listCounter - 1] : listCounter + ".";
            return `${arabicNumber} ${item.trim()}<br>`;
        });

        // Continue with other replacements...
        escaped = escaped
            .replace(/(?<!\w)[*#](?!\w)/g, "")
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/!\[([^\]]*?)\]\((.*?)\)/g, (match, alt, url) => 
                isSafeUrl(url.trim()) ? 
                    `<img src="${url.trim()}" alt="${escapeHtml(alt)}" loading="lazy" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;">` : 
                    escapeHtml(match)
            )
            .replace(/\[([^\]]+)\]\((.*?)\)/g, (match, text, url) => 
                isSafeUrl(url.trim()) ? 
                    `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer" style="color:var(--linkC, #2563eb); text-decoration:underline;">${escapeHtml(text)}</a>` : 
                    escapeHtml(match)
            )
            .replace(/`([^`]+)`/g, (match, code) => 
                `<code style="background:var(--contentBa, #f4f8ff); padding:2px 6px; border-radius:4px; border:1px solid var(--contentL, #e3e7ef);">${escapeHtml(code)}</code>`
            )
            .replace(/\*\*(.*?)\*\*/g, (match, bold) => 
                `<b style="font-weight:600;">${escapeHtml(bold)}</b>`
            )
            .replace(/\*(.*?)\*/g, (match, italic) => 
                `<i style="font-style:italic;">${escapeHtml(italic)}</i>`
            )
            .replace(/(^|\s)(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|bmp))(?![^<]*>)/gi, (match, space, url) => 
                isSafeUrl(url) ? 
                    `${space}<img src="${url}" loading="lazy" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;">` : 
                    match
            )
            .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, (match, space, url) => 
                isSafeUrl(url) ? 
                    `${space}<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--linkC, #2563eb); text-decoration:underline;">${escapeHtml(url)}</a>` : 
                    match
            )
            .replace(/\n\n+/g, "<br><br>")
            .replace(/\n/g, "<br>")
            .replace(/(<br>){3,}/g, "<br><br>");

        return escaped;
    }

    function loadUsage() {
        try {
            let usage = localStorage.getItem(USAGE_KEY);
            if (!usage) return initUsage();
            let data = JSON.parse(usage);
            let today = new Date().toISOString().slice(0, 10);
            if (data.date !== today) return initUsage();
            return data;
        } catch (err) {
            return initUsage();
        }
    }

    function initUsage() {
        let today = new Date().toISOString().slice(0, 10);
        let usage = { date: today, count: 0, limit: 25 };
        localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
        return usage;
    }

    function remainingMessages() {
        let isUnlimited = "1" === localStorage.getItem(DEV_FLAG_KEY);
        if (isUnlimited) return Infinity;
        let usage = loadUsage();
        return Math.max(0, usage.limit - usage.count);
    }

    function refreshUsageUI() {
        let remaining = remainingMessages();
        document.getElementById("modweeb-remaining").textContent = 
            remaining === Infinity ? "غير محدود" : `الرسائل المتبقية: ${remaining}`;
    }

    let messagesLoaded = false;

    function saveHistory() {
        try {
            let messages = [...messagesContainer.children];
            let history = messages.map(msg => ({
                role: msg.classList.contains("modweeb-msg-user") ? "user" : "assistant",
                html: msg.querySelector(".bubble") ? msg.querySelector(".bubble").innerHTML : msg.innerHTML
            }));
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (err) {}
    }

    function restoreHistory() {
        try {
            let history = localStorage.getItem(HISTORY_KEY);
            if (!history) return;
            let messages = JSON.parse(history);
            messagesContainer.innerHTML = "";
            messages.forEach(msgData => {
                let msgDiv = document.createElement("div");
                if (msgData.role === "user") {
                    msgDiv.className = "modweeb-msg-user";
                } else {
                    msgDiv.className = "modweeb-msg-ai";
                }

                let bubble = document.createElement("div");
                bubble.className = "bubble";
                bubble.innerHTML = msgData.html;
                msgDiv.appendChild(bubble);

                // Add control buttons
                let controls = document.createElement("div");
                controls.className = "modweeb-controls-top";
                
                if (msgData.role === "user") {
                    controls.innerHTML = `
                        <button class="edit-user" title="تعديل">
                            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5l4 4L7 20H3v-4L16.5 3.5z"></path>
                            </svg>
                        </button>
                    `;
                } else {
                    controls.innerHTML = `
                        <button class="copy-reply" title="نسخ الرد">
                            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                                <rect width="10" height="10" x="8" y="2" rx="2"></rect>
                            </svg>
                        </button>
                    `;
                }
                msgDiv.appendChild(controls);
                messagesContainer.appendChild(msgDiv);
            });
            messagesLoaded = true;
            setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 100);
        } catch (err) {}
    }

    function showStatus(message, duration = 1600) {
        statusDiv.style.display = "block";
        statusDiv.textContent = message;
        if (duration > 0) {
            setTimeout(() => { statusDiv.style.display = "none"; }, duration);
        }
    }

    function createUserMessage(text) {
        let msgDiv = document.createElement("div");
        msgDiv.className = "modweeb-msg-user";

        let controls = document.createElement("div");
        controls.className = "modweeb-controls-top";
        controls.innerHTML = `
            <button class="edit-user" title="تعديل">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5l4 4L7 20H3v-4L16.5 3.5z"></path>
                </svg>
            </button>
        `;
        msgDiv.appendChild(controls);

        let bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = renderRichText(text);
        msgDiv.appendChild(bubble);

        messagesContainer.appendChild(msgDiv);
        return msgDiv;
    }

    function createAiPlaceholder() {
        let msgDiv = document.createElement("div");
        msgDiv.className = "modweeb-msg-ai";

        let bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><div class="spinner" aria-hidden="true"></div> جاري الكتابة...</div>`;
        msgDiv.appendChild(bubble);

        let controls = document.createElement("div");
        controls.className = "modweeb-controls-top";
        controls.innerHTML = `
            <button class="copy-reply" title="نسخ الرد">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                    <rect width="10" height="10" x="8" y="2" rx="2"></rect>
                </svg>
            </button>
            <button class="resend-retry" title="إعادة المحاولة" style="display:none">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M23 4v6h-6"></path>
                    <path d="M1 20v-6h6"></path>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
                </svg>
            </button>
        `;
        msgDiv.appendChild(controls);

        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return msgDiv;
    }

    function buildConversationPayload(newMessage) {
        let messages = [...messagesContainer.children];
        let conversation = [
            { role: "system", content: "أنت مساعد تقني لمدونة modweeb.com، أجِب بشكل مختصر وعملي واحترافي." }
        ];

        messages.forEach(msg => {
            let isUser = msg.classList.contains("modweeb-msg-user");
            let bubble = msg.querySelector(".bubble");
            if (!bubble) return;
            let content = bubble.innerText || bubble.textContent || "";
            conversation.push({ role: isUser ? "user" : "assistant", content: content });
        });

        if (newMessage) {
            conversation.push({ role: "user", content: newMessage });
        }

        return conversation;
    }

    async function sendMessage(message, placeholder = null, isRetry = false) {
        let isUnlimited = "1" === localStorage.getItem(DEV_FLAG_KEY);
        if (!isUnlimited) {
            let usage = loadUsage();
            if (usage.count >= usage.limit) {
                showStatus("تم تجاوز الحد اليومي للرسائل");
                return false;
            }
        }

        let aiMsg = placeholder || createAiPlaceholder();
        showStatus("جاري إرسال الرسالة...");
        modweebTrackEvent("chat_message_sent");

        let conversation = buildConversationPayload(message);

        try {
            let response = await fetch("https://router.huggingface.co/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: HUGGING_FACE_MODEL,
                    messages: conversation,
                    max_tokens: 1000,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });

            if (!response.ok) throw Error("network");

            let data = await response.json();
            let content = data?.choices?.[0]?.message?.content || "❌ حدث خطأ.";
            let formattedContent = renderRichText(content);

            let bubble = aiMsg.querySelector(".bubble");
            if (bubble) {
                bubble.innerHTML = formattedContent;
            }

            let retryBtn = aiMsg.querySelector(".resend-retry");
            if (retryBtn) {
                retryBtn.style.display = "none";
            }

            let usage = loadUsage();
            usage.count = (usage.count || 0) + 1;
            localStorage.setItem(USAGE_KEY, JSON.stringify(usage));

            refreshUsageUI();
            saveHistory();
            showStatus("تم الرد بنجاح!");
            modweebTrackEvent("chat_message_received", { tokens: data?.usage?.total_tokens || 0 });

            return true;
        } catch (error) {
            let bubble = aiMsg.querySelector(".bubble");
            if (bubble) {
                bubble.innerHTML = `<div style="color:#ef4444;">❌ تعذر استجابة المساعد</div>`;
            }

            let retryBtn = aiMsg.querySelector(".resend-retry");
            if (retryBtn) {
                retryBtn.style.display = "inline-block";
                retryBtn.onclick = async function() {
                    retryBtn.disabled = true;
                    retryBtn.textContent = "...";
                    bubble.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><div class="spinner"></div> إعادة المحاولة...</div>`;
                    await sendMessage(message, aiMsg, true);
                    retryBtn.disabled = false;
                    retryBtn.textContent = "إعادة";
                };
            }

            saveHistory();
            showStatus("تعذر الاتصال بالخادم");
            return false;
        }
    }

    function lazyLoadMessages() {
        if (!messagesLoaded) {
            let welcomeMsg = document.createElement("div");
            welcomeMsg.className = "modweeb-msg-ai";

            let bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.innerHTML = `👋 مرحبًا بك في دردشة <b>modweeb.com</b>! كيف أساعدك؟`;
            welcomeMsg.appendChild(bubble);

            let controls = document.createElement("div");
            controls.className = "modweeb-controls-top";
            controls.innerHTML = `
                <button class="copy-reply" title="نسخ الرد">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                        <rect width="10" height="10" x="8" y="2" rx="2"></rect>
                    </svg>
                </button>
            `;
            welcomeMsg.appendChild(controls);

            messagesContainer.appendChild(welcomeMsg);
            messagesLoaded = true;
            modweebTrackEvent("chat_opened");
            setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 100);
        }
    }

    // Event Listeners
    btn.onclick = function() {
        widgetContainer.style.display = "block";
        container.style.display = "flex";
        container.style.position = "absolute";
        container.style.left = "";
        container.style.top = "";
        container.style.right = "32px";
        container.style.bottom = "142px";
        lazyLoadMessages();
        setTimeout(function() { inputArea.focus(); }, 100);
        window.modweebChatOpenedAt = Date.now();
        refreshUsageUI();
        restoreHistory();
    };

    closeBtn.onclick = function() {
        widgetContainer.style.display = "none";
        container.style.display = "none";
        container.style.position = "absolute";
        container.style.left = "";
        container.style.top = "";
        container.style.right = "32px";
        container.style.bottom = "142px";
        if (window.modweebChatOpenedAt) {
            modweebTrackEvent("chat_duration", { value: Date.now() - window.modweebChatOpenedAt });
        }
    };

    widgetContainer.onclick = function(e) {
        if (e.target === widgetContainer) {
            widgetContainer.style.display = "none";
            container.style.display = "none";
        }
    };

    inputArea.addEventListener("input", function(e) {
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 62) + "px";
        charsUI.textContent = `${e.target.value.length} أحرف`;
    });

    inputArea.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !e.shiftKey || (e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            sendBtn.click();
            return;
        }
        if (e.key === "ArrowUp" && inputArea.value.trim() === "") {
            let userMessages = [...messagesContainer.children].reverse();
            let lastUserMsg = userMessages.find(msg => msg.classList.contains("modweeb-msg-user"));
            if (lastUserMsg) {
                let text = lastUserMsg.querySelector(".bubble").innerText || "";
                inputArea.value = text;
                inputArea.dispatchEvent(new Event("input"));
            }
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            widgetContainer.style.display = "none";
            container.style.display = "none";
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            widgetContainer.style.display = "block";
            container.style.display = "flex";
            setTimeout(() => inputArea.focus(), 100);
        }
    });

    suggestions.forEach(btn => {
        btn.onclick = () => {
            inputArea.value = btn.textContent;
            inputArea.focus();
            inputArea.dispatchEvent(new Event("input"));
        };
    });

    copyAllBtn.onclick = function() {
        let allText = [...messagesContainer.children].map(msg => msg.innerText).join("\n");
        navigator.clipboard.writeText(allText).then(() => showStatus("تم نسخ المحادثة!"));
    };

    clearBtn.onclick = function() {
        localStorage.removeItem(HISTORY_KEY);
        messagesContainer.innerHTML = "";
        messagesLoaded = false;
        lazyLoadMessages();
        showStatus("تم حذف المحادثة!");
    };

    messagesContainer.addEventListener("click", function(e) {
        let target = e.target;
        if (target.closest(".copy-reply")) {
            let aiMsg = target.closest(".modweeb-msg-ai");
            if (!aiMsg) return;
            let text = aiMsg.querySelector(".bubble").innerText || "";
            navigator.clipboard.writeText(text).then(() => showStatus("تم نسخ الرد!"));
        }
        if (target.closest(".edit-user")) {
            let userMsg = target.closest(".modweeb-msg-user");
            if (!userMsg) return;
            let text = userMsg.querySelector(".bubble").innerText || "";
            inputArea.value = text;
            inputArea.focus();
            inputArea.dispatchEvent(new Event("input"));
        }
    });

    sendBtn.onclick = async function() {
        let message = inputArea.value.trim();
        if (!message) return;

        let isUnlimited = "1" === localStorage.getItem(DEV_FLAG_KEY);
        if (!isUnlimited) {
            let usage = loadUsage();
            if (usage.count >= usage.limit) {
                showStatus("تم تجاوز الحد اليومي للرسائل");
                return;
            }
        }

        createUserMessage(message);
        inputArea.value = "";
        inputArea.style.height = "auto";
        charsUI.textContent = `0 أحرف`;

        let aiPlaceholder = createAiPlaceholder();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        saveHistory();
        await sendMessage(message, aiPlaceholder);
    };

    // Initialize
    restoreHistory();
    refreshUsageUI();

    let headerClickCount = 0;
    let headerClickTimer = null;

    function modweebTrackEvent(event, params) {
        window.gtag && gtag("event", event, params || {});
    }

    function adjustForKeyboard() {
        let viewportHeight = window.visualViewport.height;
        let windowHeight = window.innerHeight;
        if (windowHeight - viewportHeight > 150) {
            container.style.bottom = "10px";
            btn.style.bottom = "10px";
        } else {
            container.style.bottom = "142px";
            btn.style.bottom = "88px";
        }
    }

    head.addEventListener("click", function(e) {
        headerClickCount++;
        if (headerClickTimer) clearTimeout(headerClickTimer);
        headerClickTimer = setTimeout(() => { headerClickCount = 0; }, 4000);
        if (headerClickCount >= 5) {
            headerClickCount = 0;
            let isUnlimited = "1" === localStorage.getItem(DEV_FLAG_KEY);
            if (isUnlimited) {
                localStorage.removeItem(DEV_FLAG_KEY);
                showStatus("وضع المطور معطل");
            } else {
                localStorage.setItem(DEV_FLAG_KEY, "1");
                showStatus("وضع المطور مفعل: غير محدود");
            }
            refreshUsageUI();
        }
    });

    messagesContainer.style.minHeight = "60px";
    window.visualViewport.addEventListener("resize", adjustForKeyboard);
    window.visualViewport.addEventListener("scroll", adjustForKeyboard);
}
