// URL do backend (ajuste para seu servidor)
const API_URL = "https://chatbot-inteligente-com-ia.onrender.com";

// Adiciona uma mensagem ao chat
function addMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Envia a mensagem para o backend
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    input.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        addMessage(data.response || '🤖 Sem resposta.', 'bot');
    } catch (error) {
        console.error('Erro na requisição:', error);
        addMessage('⚠️ Erro ao conectar com o servidor.', 'bot');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// Envia mensagem ao apertar "Enter"
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
