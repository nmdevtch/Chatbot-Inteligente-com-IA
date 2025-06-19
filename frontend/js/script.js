// Menu Hamburguer
function toggleMenu() {
    const nav = document.getElementById('nav');
    nav.classList.toggle('active');
}

// Modal Login
function openModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function loginDashboard() {
    const token = document.getElementById('modalToken').value;
    document.getElementById('tokenInput').value = token;
    closeModal();
    buscarLeads();
}

// Buscar Leads
function buscarLeads() {
    const token = document.getElementById('tokenInput').value;
    const apiURL = "https://chatbot-inteligente-com-ia.onrender.com/leads"; // ajuste conforme seu backend

    if (!token) {
        alert("Por favor, insira seu token.");
        return;
    }

    fetch(apiURL, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#leadsTable tbody');
        tbody.innerHTML = '';
        data.forEach(lead => {
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
    })
    .catch(() => {
        alert("Erro ao buscar dados. Verifique o token ou o servidor.");
    });
}
