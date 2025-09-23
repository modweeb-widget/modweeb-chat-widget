function bloggerGemini(config){const{elementContainer='.elcreative-gemini',apiKey=''}=config.config||{};const container=document.querySelector(elementContainer);if(!container)return;container.innerHTML=`
        <button class="chat-btn">💬</button>
        <div class="chat-container">
            <div class="api-config">
                <input type="password" placeholder="أدخل مفتاح API الخاص بك" class="api-key-input">
                <button class="save-api-btn">حفظ المفتاح</button>
            </div>
            <div class="chat-header">
                <h3>Gemini AI Chat</h3>
                <button class="close-btn">✕</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="اكتب رسالتك هنا..."></textarea>
                <button class="send-btn">إرسال</button>
            </div>
        </div>
    `;const chatBtn=container.querySelector('.chat-btn');const chatContainer=container.querySelector('.chat-container');const closeBtn=container.querySelector('.close-btn');const messagesContainer=container.querySelector('.chat-messages');const textInput=container.querySelector('textarea');const sendBtn=container.querySelector('.send-btn');const apiKeyInput=container.querySelector('.api-key-input');const saveApiBtn=container.querySelector('.save-api-btn');let currentApiKey=localStorage.getItem('gemini_api_key')||apiKey;if(currentApiKey){apiKeyInput.value='*'.repeat(16);container.querySelector('.api-config').style.display='none';}function addMessage(content,isUser){const messageDiv=document.createElement('div');messageDiv.className=`message ${isUser?'user':'ai'}`;messageDiv.textContent=content;messagesContainer.appendChild(messageDiv);messagesContainer.scrollTop=messagesContainer.scrollHeight;}async function sendMessage(){const message=textInput.value.trim();if(!message)return;if(!currentApiKey){alert('الرجاء إدخال مفتاح API أولاً');return;}addMessage(message,true);textInput.value='';const loadingMessage=addMessage('جاري الكتابة...',false);try{const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${currentApiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:message}]}]})});if(!response.ok)throw new Error('فشل في الاتصال');const data=await response.json();const aiResponse=data.candidates[0].content.parts[0].text;loadingMessage.remove();addMessage(aiResponse,false);}catch(error){loadingMessage.remove();addMessage('❌ حدث خطأ: '+error.message,false);}}chatBtn.addEventListener('click',()=>{chatContainer.style.display='flex';});closeBtn.addEventListener('click',()=>{chatContainer.style.display='none';});sendBtn.addEventListener('click',sendMessage);textInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});saveApiBtn.addEventListener('click',()=>{const newApiKey=apiKeyInput.value.trim();if(newApiKey&&newApiKey!=='*'.repeat(16)){currentApiKey=newApiKey;localStorage.setItem('gemini_api_key',newApiKey);container.querySelector('.api-config').style.display='none';alert('تم حفظ المفتاح بنجاح!');}});if(!currentApiKey){chatContainer.style.display='flex';}}
