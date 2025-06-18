const API_URL = "https://chatbot-inteligente-com-ia.onrender.com/lead";

const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');

const perguntas = [
    "Olá! Seja bem-vindo. Me informe seu nome para começarmos.",
    "Qual seu telefone?",
    "Qual sua idade?",
    "Qual seu e-mail?",
    "De qual cidade você é?"
];

let respostas = [];
let etapa = 0;

function addMessage(message, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    respostas.push(msg);
    input.value = '';

    etapa++;

    if (etapa < perguntas.length) {
        setTimeout(() => addMessage(perguntas[etapa], 'bot'), 500);
    } else {
        salvarLead();
    }
}

function salvarLead() {
    const [nome, telefone, idade, email, cidade] = respostas;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone, idade, email, cidade })
    })
    .then(res => res.json())
    .then(() => {
        addMessage('Perfeito! Clique no botão abaixo para falar conosco no WhatsApp.', 'bot');
        const link = document.createElement('a');
        link.href = 'https://wa.me/5541984842781';
        link.target = '_blank';
        link.innerText = '👉 Falar no WhatsApp';
        link.className = 'whatsapp-link';
        chatBox.appendChild(link);
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(() => {
        addMessage('⚠️ Erro ao salvar seus dados. Tente novamente mais tarde.', 'bot');
    });
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

window.onload = () => {
    addMessage(perguntas[0], 'bot');
};
