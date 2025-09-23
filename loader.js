function loadModweebChat(options = {}) {
    const config = {
        cssUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.css',
        jsUrl: 'https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-chat-widget@main/dist/modweeb-chat.min.js',
        position: 'bottom-right',
        theme: 'light',
        dailyLimit: 25,
        ...options
    };

    if (window.modweebChatLoaded) return;
    window.modweebChatLoaded = true;

    // تحميل CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = config.cssUrl;
    cssLink.onerror = () => console.error('Failed to load chat CSS');
    document.head.appendChild(cssLink);

    // إضافة HTML
    const container = document.createElement('div');
    container.id = 'modweeb-global-container';
    document.body.appendChild(container);

    // تحميل JavaScript
    const script = document.createElement('script');
    script.src = config.jsUrl;
    script.onload = () => console.log('Modweeb chat loaded successfully');
    script.onerror = () => console.error('Failed to load chat script');
    document.body.appendChild(script);

    return true;
}

window.loadModweebChat = loadModweebChat;
