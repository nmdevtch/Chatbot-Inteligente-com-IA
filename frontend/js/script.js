// ===== Menu Mobile =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// ===== Modal Login =====
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.getElementsByClassName('close')[0];

loginBtn.onclick = function() {
    loginModal.style.display = 'block';
};

closeBtn.onclick = function() {
    loginModal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
};

// ===== Acessar Dashboard com Token =====
function acessarDashboard() {
    const token = document.getElementById('tokenInput').value.trim();

    if (token === '') {
        alert('Digite seu token!');
        return;
    }

    if (token === 'Admin123') { 
        window.location.href = './dashboard.html';
    } else {
        alert('Token inválido!');
    }
}

// ===== Chatbot com Captação de Leads =====
const API_URL = "https://chatbot-inteligente-com-ia.onrender.com";

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

const leadData = {
    nome: '',
    telefone: '',
    idade: '',
    email: '',
    cidade: ''
};

const perguntas = [
    "Qual seu nome completo?",
    "Ótimo! Agora, informe seu telefone com DDD:",
    "Perfeito. Qual sua idade?",
    "Legal! Agora, digite seu email:",
    "Por último, informe sua cidade:"
];

let etapa = 0;

function startChat() {
    appendMessage('bot', "Olá! Vamos fazer seu cadastro. 😊");
    setTimeout(() => {
        appendMessage('bot', perguntas[etapa]);
    }, 600);
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage('user', message);
    userInput.value = '';

    processarEtapa(message);
}

function processarEtapa(message) {
    switch (etapa) {
        case 0:
            leadData.nome = message;
            break;
        case 1:
            leadData.telefone = message;
            break;
        case 2:
            leadData.idade = message;
            break;
        case 3:
            leadData.email = message;
            break;
        case 4:
            leadData.cidade = message;
            break;
    }

    etapa++;

    if (etapa < perguntas.length) {
        setTimeout(() => {
            appendMessage('bot', perguntas[etapa]);
        }, 500);
    } else {
        salvarLead();
    }
}

function salvarLead() {
    appendMessage('bot', "Perfeito! Salvando seus dados... 🔄");

    fetch(`${API_URL}/lead`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
    })
    .then(response => {
        if (response.ok) {
            appendMessage('bot', "✅ Seus dados foram salvos com sucesso!");
            gerarLinkWhatsApp();
        } else {
            appendMessage('bot', "❌ Erro ao salvar seus dados. Tente novamente mais tarde.");
        }
    })
    .catch(() => {
        appendMessage('bot', "❌ Erro ao conectar com o servidor.");
    });
}

function gerarLinkWhatsApp() {
    const numero = leadData.telefone.replace(/\D/g, '');
    const mensagem = `Olá, me chamo ${leadData.nome} e acabei de me cadastrar no Lead Master!`;

    const link = `https://wa.me/5541984842781`;

    appendMessage('bot', `Clique no link para falar conosco no WhatsApp:`);
    appendMessage('bot', link);
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ===== Enter para enviar no chat =====
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// ===== Inicia Conversa =====
startChat();
