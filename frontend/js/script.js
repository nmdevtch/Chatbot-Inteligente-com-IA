const API_URL = "https://seu-backend.onrender.com/chat"; // <-- Troque pela URL da sua API

function addMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        addMessage(data.response, 'bot');
    })
    .catch(err => {
        addMessage("Erro ao conectar com o servidor.", 'bot');
        console.error(err);
    });
}
