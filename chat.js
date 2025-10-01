function modweebChat(options) {
    const HUGGING_FACE_TOKEN = options.config.hfToken;
    const HUGGING_FACE_MODEL = options.config.hfModel;
    const USAGE_KEY = "modweebChatUsage_v1";
    const HISTORY_KEY = "modweebChatHistory_v1";
    const DEV_FLAG_KEY = "modweebDevUnlimited_v1";
    const DEFAULT_DAILY_LIMIT = 25;

    // 1. HTML المُحدَّث مع إضافة modweeb-widget-container كـ Backdrop
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
                    <button class="modweeb-suggestion-btn">اكتب مقدمة لتدوينة عن الذكاء الاصطناعي</button>
                    <button class="modweeb-suggestion-btn">ما هي أفضل استراتيجيات التسويق بالمحتوى؟</button>
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

    // 2. إدراج الـ HTML في الصفحة
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = WIDGET_HTML;
    while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
    }

    // 3. تعريف العناصر
    const chatBtn = document.getElementById("modweeb-chat-btn");
    const widgetContainer = document.getElementById("modweeb-widget-container"); // Backdrop/الخلفية
    const chatContainer = document.getElementById("modweeb-chat-container");
    const messagesContainer = document.getElementById("modweeb-messages");
    const statusUI = document.getElementById("modweeb-status");
    const inputArea = document.getElementById("modweeb-input");
    const sendBtn = document.getElementById("modweeb-send");
    const closeBtn = document.getElementById("modweeb-chat-close");
    const charsUI = document.getElementById("modweeb-chars");
    const head = document.getElementById("modweeb-head");
    const copyAllBtn = document.getElementById("modweeb-copy-all");
    const clearBtn = document.getElementById("modweeb-clear");
    const suggestionBtns = document.querySelectorAll(".modweeb-suggestion-btn");

    let isSending = false;

    // --- منطق حالة الاستخدام (Usage State) ---
    function loadUsage() {
        const stored = localStorage.getItem(USAGE_KEY);
        const today = new Date().toDateString();
        let usage = stored ? JSON.parse(stored) : { date: today, count: 0 };
        if (usage.date !== today) {
            usage = { date: today, count: 0 };
        }
        usage.limit = DEFAULT_DAILY_LIMIT;
        return usage;
    }

    function saveUsage(usage) {
        localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    }

    function refreshUsageUI() {
        const usage = loadUsage();
        const remainingUI = document.getElementById("modweeb-remaining");
        const isDev = "1" === localStorage.getItem(DEV_FLAG_KEY);
        remainingUI.textContent = isDev ? "وضع المطور: غير محدود" : `الرسائل المتبقية: ${usage.limit - usage.count}`;
    }

    // --- منطق التاريخ (History) ---
    function saveHistory() {
        const history = [];
        messagesContainer.querySelectorAll(".modweeb-msg-user, .modweeb-msg-ai").forEach(msgDiv => {
            const type = msgDiv.classList.contains("modweeb-msg-user") ? "user" : "ai";
            const content = msgDiv.querySelector(".bubble").innerHTML;
            history.push({ type, content });
        });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function restoreHistory() {
        const history = localStorage.getItem(HISTORY_KEY);
        if (history) {
            try {
                const historyArr = JSON.parse(history);
                historyArr.forEach(msg => {
                    if (msg.type === "user") {
                        createUserMessage(msg.content, true);
                    } else {
                        createAiMessage(msg.content, true);
                    }
                });
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (e) {
                console.error("Failed to restore chat history:", e);
                localStorage.removeItem(HISTORY_KEY);
            }
        }
    }

    function clearHistory() {
        localStorage.removeItem(HISTORY_KEY);
        messagesContainer.innerHTML = "";
        messagesContainer.style.minHeight = "60px";
        messagesContainer.scrollTop = 0;
        showStatus("تم حذف المحادثة.");
    }

    // --- مساعدات HTML والرسائل ---

    // دالة إنشاء فقاعة رسالة المستخدم (مُعدَّلة لإضافة زر التعديل في الموضع الجديد)
    function createUserMessage(text, isRestore = false) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "modweeb-msg-user";
        msgDiv.setAttribute("data-raw-text", text);

        const controlsTop = document.createElement("div");
        controlsTop.className = "modweeb-controls-top";
        controlsTop.innerHTML = `
            <button class="edit-user" title="تعديل الرسالة">
                <svg class="modweeb-svg-h" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M12 20h9"></path><path d="M16.5 3.5l4 4L7 20H3v-4L16.5 3.5z"></path>
                </svg>
                تعديل
            </button>
        `;
        msgDiv.appendChild(controlsTop);

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = markdownToHtml(text);
        msgDiv.appendChild(bubble);
        messagesContainer.appendChild(msgDiv);

        if (!isRestore) {
            scrollToBottom();
        }
        return msgDiv;
    }

    // دالة إنشاء فقاعة رسالة AI (مُعدَّلة لإضافة زر النسخ في الموضع الجديد)
    function createAiMessage(htmlContent, isRestore = false) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "modweeb-msg-ai";
        msgDiv.setAttribute("data-raw-text", htmlContent);

        const controlsTop = document.createElement("div");
        controlsTop.className = "modweeb-controls-top";
        controlsTop.innerHTML = `
            <button class="copy-ai" title="نسخ الرسالة">
                <svg class="modweeb-svg-h" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M15 7h4v13c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h4"></path><path d="M18 1v4H9c-1.1 0-2 .9-2 2v10"></path>
                </svg>
                نسخ
            </button>
        `;
        msgDiv.appendChild(controlsTop);

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = htmlContent;
        msgDiv.appendChild(bubble);

        const metaDiv = document.createElement("div");
        metaDiv.className = "meta";
        metaDiv.innerHTML = `<span><svg class="modweeb-svg-h" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8 8V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"></path><path d="M16 12H8"></path><path d="M21 17H3"></path><path d="M19 12h-4v8H19v-8z"></path></svg> Gemma AI</span>`;
        msgDiv.appendChild(metaDiv);

        messagesContainer.appendChild(msgDiv);

        if (!isRestore) {
            scrollToBottom();
        }
        return msgDiv;
    }

    function createAiPlaceholder() {
        const msgDiv = createAiMessage("", false);
        const bubble = msgDiv.querySelector(".bubble");
        bubble.innerHTML = `<span class="placeholder-text">...جاري الكتابة</span>`;
        return bubble;
    }

    function markdownToHtml(md) {
        // تحويل رؤوس النصوص
        md = md.replace(/^### (.*$)/gim, '<b>$1</b>');
        md = md.replace(/^## (.*$)/gim, '<b>$1</b>');
        md = md.replace(/^# (.*$)/gim, '<b>$1</b>');

        // تحويل القوائم المُرقمة
        let olCounter = 1;
        md = md.replace(/^(\d+\. |\* ) (.*$)/gim, (match, p1, p2) => {
            if (p1.trim() === '*') {
                return `<li>${p2}</li>`;
            } else {
                return `<li>${p2}</li>`;
            }
        });
        md = md.replace(/(<li>.*<\/li>(\s*))+/gim, (match) => {
            if (match.includes("1.")) { // يمكن أن يكون هذا غير دقيق، لكنه بسيط لتمييز القوائم
                return `<ol>${match}</ol>`;
            } else {
                return `<ul>${match}</ul>`;
            }
        });

        // تحويل الخطوط العريضة والمائلة
        md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        md = md.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // تحويل الروابط
        md = md.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

        // استبدال الأسطر الجديدة بـ <br>، ولكن ليس داخل القوائم
        md = md.replace(/\n(?!<ol>|<ul|<li)/g, '<br>');

        return md.trim();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showStatus(text) {
        statusUI.textContent = text;
        statusUI.style.display = "block";
        setTimeout(() => {
            statusUI.style.display = "none";
        }, 3000);
    }

    // --- منطق إرسال الرسالة ---
    async function sendMessage(prompt, placeholderBubble) {
        if (!prompt || isSending) return;

        isSending = true;
        sendBtn.disabled = true;
        inputArea.disabled = true;

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/" + HUGGING_FACE_MODEL, {
                headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}`, "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            });

            const result = await response.json();
            let aiText = "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. قد تكون خدمة Hugging Face غير متاحة حالياً.";

            if (result && result.length > 0 && result[0].generated_text) {
                aiText = result[0].generated_text.trim();
                // إزالة جزء الإدخال إذا كان الذكاء الاصطناعي يعيده في بداية النص
                if (aiText.startsWith(prompt)) {
                    aiText = aiText.substring(prompt.length).trim();
                }
            }

            placeholderBubble.innerHTML = markdownToHtml(aiText);

            // تحديث الاستخدام وحفظ التاريخ فقط عند نجاح الرد
            const isDev = "1" === localStorage.getItem(DEV_FLAG_KEY);
            if (!isDev) {
                const usage = loadUsage();
                usage.count++;
                saveUsage(usage);
                refreshUsageUI();
            }

        } catch (error) {
            console.error("AI API Error:", error);
            placeholderBubble.innerHTML = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
        } finally {
            isSending = false;
            sendBtn.disabled = false;
            inputArea.disabled = false;
            scrollToBottom();
            saveHistory();
        }
    }


    // --- منطق الحدث (Event Handlers) ---

    // 4. دالة الإظهار والإخفاء المُعدَّلة (لاستخدام backdrop)
    function toggleChat() {
        const isOpen = widgetContainer.style.display === "block";
        if (isOpen) {
            widgetContainer.style.display = "none";
            chatContainer.style.display = "none";
            chatBtn.setAttribute("aria-label", "فتح الدردشة");
        } else {
            widgetContainer.style.display = "block";
            chatContainer.style.display = "flex";
            inputArea.focus();
            scrollToBottom();
            chatBtn.setAttribute("aria-label", "غلق الدردشة");
        }
    }

    // 5. دالة ضبط الموضع عند فتح الكيبورد (إصلاح مشكلة التمرير)
    function adjustForKeyboard() {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;

        // إذا كانت لوحة المفاتيح مفتوحة (بافتراض أن الفرق أكبر من 150 بكسل)
        if (windowHeight - viewportHeight > 150) {
            // رفع النافذة والزر إلى أسفل الشاشة
            chatContainer.style.bottom = "10px";
            chatBtn.style.bottom = "10px";
            // يجب أن تبقى الخلفية (widgetContainer) ثابتة (full screen)
        } else {
            // إعادة الوضع الطبيعي
            chatContainer.style.bottom = "142px"; // الموضع الطبيعي
            chatBtn.style.bottom = "88px";      // الموضع الطبيعي
        }
    }


    // --- ربط الأحداث ---

    chatBtn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat);
    widgetContainer.addEventListener("click", (e) => {
        if (e.target.id === "modweeb-widget-container") {
            toggleChat();
        }
    });

    sendBtn.addEventListener("click", async () => {
        const text = inputArea.value.trim();
        if (text) {
            // التحقق من الحد اليومي
            const isDev = "1" === localStorage.getItem(DEV_FLAG_KEY);
            if (!isDev) {
                const usage = loadUsage();
                if (usage.count >= usage.limit) {
                    showStatus("تم تجاوز الحد اليومي للرسائل");
                    return;
                }
            }

            createUserMessage(text);
            inputArea.value = "";
            inputArea.style.height = "auto";
            charsUI.textContent = `0 أحرف`;
            const placeholder = createAiPlaceholder();
            saveHistory();
            await sendMessage(text, placeholder);
        }
    });

    inputArea.addEventListener("input", () => {
        inputArea.style.height = "auto";
        inputArea.style.height = inputArea.scrollHeight + "px";
        charsUI.textContent = `${inputArea.value.length} أحرف`;
    });

    inputArea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // أحداث أزرار الاقتراحات
    suggestionBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            inputArea.value = btn.textContent;
            inputArea.dispatchEvent(new Event('input'));
            inputArea.focus();
        });
    });

    // حدث النقر على منطقة الرسائل (لتعديل/نسخ)
    messagesContainer.addEventListener("click", (e) => {
        const target = e.target.closest("button");
        if (!target) return;

        const parentMsg = target.closest(".modweeb-msg-user") || target.closest(".modweeb-msg-ai");
        if (!parentMsg) return;

        const rawText = parentMsg.getAttribute("data-raw-text");
        
        // منطق زر التعديل
        if (target.classList.contains("edit-user")) {
            inputArea.value = rawText;
            inputArea.dispatchEvent(new Event('input'));
            inputArea.focus();
            parentMsg.remove(); // حذف الرسالة القديمة
            saveHistory();

        // منطق زر النسخ
        } else if (target.classList.contains("copy-ai")) {
            navigator.clipboard.writeText(rawText).then(() => {
                target.textContent = "تم النسخ!";
                setTimeout(() => target.innerHTML = `<svg class="modweeb-svg-h" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 7h4v13c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h4"></path><path d="M18 1v4H9c-1.1 0-2 .9-2 2v10"></path></svg> نسخ`, 1500);
            }).catch(err => {
                console.error('Copy failed', err);
            });
        }
    });

    // حدث زر نسخ الكل
    copyAllBtn.addEventListener("click", () => {
        let allText = "--- محادثة Gemma AI ---\n\n";
        messagesContainer.querySelectorAll(".modweeb-msg-user, .modweeb-msg-ai").forEach(msgDiv => {
            const type = msgDiv.classList.contains("modweeb-msg-user") ? "أنت" : "AI";
            const rawText = msgDiv.getAttribute("data-raw-text");
            allText += `${type}: ${rawText}\n\n`;
        });

        navigator.clipboard.writeText(allText).then(() => {
            showStatus("تم نسخ المحادثة بالكامل.");
        });
    });

    // حدث زر حذف المحادثة
    clearBtn.addEventListener("click", clearHistory);


    // تفعيل وضع المطور (خمس نقرات على الرأس)
    let headerClickCount = 0;
    let headerClickTimer = null;
    head.addEventListener("click", function(e) {
        headerClickCount++;
        if (headerClickTimer) clearTimeout(headerClickTimer);
        headerClickTimer = setTimeout(() => {
            headerClickCount = 0;
        }, 4000);

        if (headerClickCount >= 5) {
            headerClickCount = 0;
            const isDev = "1" === localStorage.getItem(DEV_FLAG_KEY);
            if (isDev) {
                localStorage.removeItem(DEV_FLAG_KEY);
                showStatus("وضع المطور معطل.");
            } else {
                localStorage.setItem(DEV_FLAG_KEY, "1");
                showStatus("وضع المطور مفعل: غير محدود.");
            }
            refreshUsageUI();
        }
    });

    // تفعيل رصد تغيرات الكيبورد الافتراضية
    window.visualViewport.addEventListener("resize", adjustForKeyboard);
    // تفعيل رصد التمرير خارج منطقة الدردشة (في حال وجود مشكلة)
    window.visualViewport.addEventListener("scroll", adjustForKeyboard);


    // --- الإعداد الأولي ---
    restoreHistory();
    refreshUsageUI();
}
