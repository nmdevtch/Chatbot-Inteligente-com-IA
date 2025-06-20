// ===== Configurações Gerais =====
const API_URL = "https://chatbot-inteligente-com-ia.onrender.com";
const TOKEN = "admin123";

// Detecta se está na landing page ou dashboard
const isDashboard = document.querySelector('.main-content') !== null;
const isLandingPage = document.querySelector('.hero') !== null;

// ==================================================
// ======= FUNCIONALIDADES DA LANDING PAGE =========
// ==================================================
if (isLandingPage) {
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

    loginBtn.onclick = function () {
        loginModal.style.display = 'block';
    };

    closeBtn.onclick = function () {
        loginModal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    };

    // ===== Acessar Dashboard com Token =====
    window.acessarDashboard = function () {
        const token = document.getElementById('tokenInput').value.trim();

        if (token === '') {
            alert('Digite seu token!');
            return;
        }

        if (token === TOKEN) {
            localStorage.setItem('token', token);
            window.location.href = './dashboard.html';
        } else {
            alert('Token inválido!');
        }
    };

    // ===== Chatbot com Captação de Leads =====
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

    window.sendMessage = function () {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';

        processarEtapa(message);
    };

    function processarEtapa(message) {
        switch (etapa) {
            case 0: leadData.nome = message; break;
            case 1: leadData.telefone = message; break;
            case 2: leadData.idade = message; break;
            case 3: leadData.email = message; break;
            case 4: leadData.cidade = message; break;
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        })
            .then(response => {
                if (response.ok) {
                    appendMessage('bot', "✅ Seus dados foram salvos com sucesso!");
                    gerarBotaoWhatsApp();
                } else {
                    appendMessage('bot', "❌ Erro ao salvar seus dados. Tente novamente mais tarde.");
                }
            })
            .catch(() => {
                appendMessage('bot', "❌ Erro ao conectar com o servidor.");
            });
    }

    function gerarBotaoWhatsApp() {
        const numero = leadData.telefone.replace(/\D/g, '');
        const mensagem = `Olá, me chamo ${leadData.nome} e acabei de me cadastrar no Lead Master!`;
        const link = `https://wa.me/5541984842781?text=${encodeURIComponent(mensagem)}`;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot');

        const botao = document.createElement('button');
        botao.textContent = '💬 Falar no WhatsApp';
        botao.classList.add('whatsapp-button');

        botao.onclick = () => {
            window.open(link, '_blank');
        };

        messageDiv.appendChild(botao);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    startChat();
}

// ==================================================
// ========== FUNCIONALIDADES DO DASHBOARD =========
// ==================================================
if (isDashboard) {
    window.logout = function () {
        localStorage.removeItem('token');
        window.location.href = "./index.html";
    };

    function buscarLeads() {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Token não encontrado! Faça login novamente.");
            window.location.href = './index.html';
            return;
        }

        fetch(`${API_URL}/leads`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Token inválido ou erro na requisição');
                return res.json();
            })
            .then(leads => {
                preencherTabela(leads);
                atualizarCards(leads);
                gerarGrafico(leads);
            })
            .catch(err => {
                alert("Erro ao buscar leads: " + err.message);
                console.error(err);
            });
    }

    function preencherTabela(leads) {
        const tbody = document.getElementById('leadsTableBody');
        tbody.innerHTML = '';

        leads.forEach((lead, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${lead.nome}</td>
                <td>${lead.telefone}</td>
                <td>${lead.idade}</td>
                <td>${lead.email}</td>
                <td>${lead.cidade}</td>
                <td>${new Date(lead.datahora).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function atualizarCards(leads) {
        const totalChat = leads.length;
        const totalTelefone = leads.filter(lead => lead.telefone).length;
        const totalForm = leads.length;

        document.getElementById('chatCount').textContent = totalChat;
        document.getElementById('phoneCount').textContent = totalTelefone;
        document.getElementById('formCount').textContent = totalForm;
    }

    function gerarGrafico(leads) {
        const cidades = {};
        leads.forEach(lead => {
            cidades[lead.cidade] = (cidades[lead.cidade] || 0) + 1;
        });

        const labels = Object.keys(cidades);
        const data = Object.values(cidades);

        const ctx = document.getElementById('leadsChart').getContext('2d');

        if (window.leadsChart instanceof Chart) {
            window.leadsChart.destroy();
        }

        window.leadsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Leads por Cidade',
                    data,
                    backgroundColor: 'rgba(0, 255, 128, 0.5)',
                    borderColor: 'rgba(0, 255, 128, 1)',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    buscarLeads();
}
