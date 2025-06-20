// ===== API URL =====
const API_URL = "https://chatbot-inteligente-com-ia.onrender.com";

// ===== Logout =====
function logout() {
    localStorage.removeItem('token');
    window.location.href = "./index.html";
}

// ===== Buscar Leads =====
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

// ===== Preencher Tabela =====
function preencherTabela(leads) {
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '';

    leads.forEach(lead => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${lead.id}</td>
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

// ===== Atualizar Cards =====
function atualizarCards(leads) {
    const totalChat = leads.length;
    const totalTelefone = leads.filter(lead => lead.telefone).length;
    const totalForm = leads.length; // Se quiser, pode ajustar se houver outro tipo de origem

    document.getElementById('chatCount').textContent = totalChat;
    document.getElementById('phoneCount').textContent = totalTelefone;
    document.getElementById('formCount').textContent = totalForm;
}

// ===== Gerar Gráfico =====
function gerarGrafico(leads) {
    const cidades = {};
    leads.forEach(lead => {
        cidades[lead.cidade] = (cidades[lead.cidade] || 0) + 1;
    });

    const labels = Object.keys(cidades);
    const data = Object.values(cidades);

    const ctx = document.getElementById('leadsChart').getContext('2d');
    if (window.leadsChart) window.leadsChart.destroy(); // Reseta gráfico se já existir

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

// ======= Auto Executar no Dashboard =======
if (window.location.pathname.includes('dashboard.html')) {
    buscarLeads();
}
