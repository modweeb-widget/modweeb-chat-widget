function loadModweebChat(options = {}) {
    // منع التحميل المزدوج
    if (window.modweebChatLoaded) return;
    window.modweebChatLoaded = true;

    // الإعدادات الافتراضية
    const config = {
        cssUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.css',
        jsUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.js',
        dailyLimit: 25,
        theme: 'light',
        ...options
    };

    // تحميل CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = config.cssUrl;
    document.head.appendChild(cssLink);

    // تحميل JavaScript
    const script = document.createElement('script');
    script.src = config.jsUrl;
    document.body.appendChild(script);

    console.log('✅ تم تحميل Modweeb Chat');
}

window.loadModweebChat = loadModweebChat;
