function loadModweebChat(options = {}) {
    // منع التحميل المزدوج
    if (window.modweebChatLoaded) {
        console.warn('⚠️ Modweeb Chat is already loaded');
        return;
    }
    window.modweebChatLoaded = true;

    const config = {
        cssUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.css',
        jsUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.js',
        ...options
    };

    // تحميل CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = config.cssUrl;
    cssLink.onerror = () => console.error('❌ فشل تحميل تنسيقات الدردشة');
    document.head.appendChild(cssLink);

    // إنشاء حاوية للدردشة
    const chatRoot = document.createElement('div');
    chatRoot.id = 'modweeb-chat-root';
    document.body.appendChild(chatRoot);

    // تحميل JavaScript
    const script = document.createElement('script');
    script.src = config.jsUrl;
    script.onload = () => {
        console.log('✅ تم تحميل دردشة Modweeb بنجاح');
        // تهيئة الدردشة إذا كانت الدالة متاحة
        if (window.initModweebChat) {
            window.initModweebChat(config);
        }
    };
    script.onerror = () => console.error('❌ فشل تحميل سكريبت الدردشة');
    document.body.appendChild(script);
}

window.loadModweebChat = loadModweebChat;
