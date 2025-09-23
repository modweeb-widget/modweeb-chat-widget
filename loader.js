function loadModweebChat(options = {}) {
    // الإعدادات الافتراضية مع الروابط الصحيحة
    const config = {
        cssUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.css',
        jsUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.js',
        position: 'bottom-right',
        theme: 'light',
        dailyLimit: 25,
        ...options
    };

    // منع التحميل المزدوج
    if (window.modweebChatLoaded) return;
    window.modweebChatLoaded = true;

    // 1. تحميل CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = config.cssUrl;
    cssLink.onerror = () => console.error('فشل تحميل تنسيقات الدردشة');
    document.head.appendChild(cssLink);

    // 2. إضافة HTML (سنضيف المحتوى الحقيقي لاحقاً)
    const htmlContent = `
        <!-- سيتم إضافة كود HTML هنا من template.html -->
        <div id="modweeb-global-container">
            <!-- المحتوى سيكون هنا -->
        </div>
    `;
    
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // 3. تحميل JavaScript
    const script = document.createElement('script');
    script.src = config.jsUrl;
    script.onload = () => {
        console.log('تم تحميل دردشة Modweeb بنجاح');
        // يمكننا استدعاء دالة تهيئة هنا إذا كانت موجودة
        if (window.initModweebChat) {
            window.initModweebChat(config);
        }
    };
    script.onerror = () => console.error('فشل تحميل سكريبت الدردشة');
    document.body.appendChild(script);

    return true;
}

// جعل الدالة متاحة globally
window.loadModweebChat = loadModweebChat;
