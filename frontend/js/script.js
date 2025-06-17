// 🔗 URL do backend
const API_URL = "http://localhost:8000/chat";

// 📨 Adiciona mensagem no chat
function addMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 🚀 Envia mensagem para o backend
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

        if (!response.ok) throw new Error(`Erro na conexão: ${response.status}`);

        const data = await response.json();
        if (data.response) {
            addMessage(data.response, 'bot');
        } else {
            addMessage('🤖 Sem resposta do servidor.', 'bot');
        }
    } catch (error) {
        console.error('Erro:', error);
        addMessage('⚠️ Erro ao conectar com o servidor.', 'bot');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// ⌨️ Enter envia mensagem
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
