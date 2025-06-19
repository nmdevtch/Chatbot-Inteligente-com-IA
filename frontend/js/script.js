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

// ===== Acessar Dashboard =====
function acessarDashboard() {
    const token = document.getElementById('tokenInput').value.trim();

    if (token === "") {
        alert('Digite seu token!');
    } else {
        // Redireciona (ajuste o caminho se necessário)
        window.location.href = "./dashboard.html";
    }
}

// ===== Chatbot Simples =====
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function sendMessage() {
    const message = userInput.value.trim();

    if (message === '') return;

    appendMessage('user', message);
    userInput.value = '';

    // Resposta simulada
    setTimeout(() => {
        const botResponse = gerarResposta(message);
        appendMessage('bot', botResponse);
    }, 500);
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function gerarResposta(msg) {
    const msgLower = msg.toLowerCase();

    if (msgLower.includes('oi') || msgLower.includes('olá')) {
        return 'Olá! Como posso te ajudar?';
    }
    if (msgLower.includes('serviços')) {
        return 'Oferecemos captação de leads, dashboard inteligente e integração com WhatsApp.';
    }
    if (msgLower.includes('whatsapp')) {
        return 'Sim! Nosso chatbot pode ser integrado ao seu WhatsApp para automação.';
    }
    if (msgLower.includes('dashboard')) {
        return 'Nosso dashboard permite visualizar e gerenciar seus leads em tempo real.';
    }
    return 'Desculpe, não entendi. Pode reformular sua pergunta?';
}

// ===== Enter para enviar no chat =====
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
