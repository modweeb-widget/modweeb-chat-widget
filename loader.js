function loadModweebChat(options = {}) {
    const config = {
        cssUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.css',
        jsUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.js',
        position: 'bottom-right',
        theme: 'light',
        dailyLimit: 25,
        ...options
    };

    // منع التحميل المزدوج
    if (window.modweebChatLoaded) {
        console.log('Modweeb Chat is already loaded');
        return;
    }
    window.modweebChatLoaded = true;

    // 1. تحميل CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = config.cssUrl;
    cssLink.onerror = () => console.error('❌ Failed to load Modweeb Chat CSS');
    document.head.appendChild(cssLink);

    // 2. إنشاء العنصر الحاوي للدردشة
    const chatContainer = document.createElement('div');
    chatContainer.id = 'modweeb-chat-root';
    chatContainer.setAttribute('data-theme', config.theme);
    chatContainer.setAttribute('data-position', config.position);
    document.body.appendChild(chatContainer);

    // 3. تحميل JavaScript
    const script = document.createElement('script');
    script.src = config.jsUrl;
    script.onload = () => {
        console.log('✅ Modweeb Chat loaded successfully');
        
        // تهيئة الدردشة بعد تحميل السكريبت
        if (window.initModweebChat) {
            window.initModweebChat(config);
        }
    };
    script.onerror = () => console.error('❌ Failed to load Modweeb Chat script');
    document.body.appendChild(script);

    return true;
}

// جعل الدالة متاحة globally
window.loadModweebChat = loadModweebChat;

// التحميل التلقائي إذا كانت هناك إعدادات مسبقة
if (window.modweebChatAutoLoad) {
    loadModweebChat(window.modweebChatAutoLoad);
}
