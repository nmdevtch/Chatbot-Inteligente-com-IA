const API_URL = "https://chatbot-inteligente-com-ia.onrender.com";

// ========== Gráfico ==========
const ctx = document.getElementById('leadsChart').getContext('2d');
const leadsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Leads',
            data: [],
            backgroundColor: '#00ffa6',
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// ========== Buscar Leads ==========
fetch(`${API_URL}/leads`)
    .then(res => res.json())
    .then(data => {
        const tableBody = document.getElementById('leadsTableBody');
        const labels = [];
        const counts = {};

        let chat = 0;
        let phone = 0;
        let form = 0;

        data.forEach((lead, index) => {
            // Tabela
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lead.id}</td>
                <td>${lead.nome}</td>
                <td>${lead.telefone}</td>
                <td>${lead.idade}</td>
                <td>${lead.email}</td>
                <td>${lead.cidade}</td>
                <td>${new Date(lead.datahora).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);

            // Contagem simples fictícia para gráfico e cards
            const date = new Date(lead.datahora).toLocaleDateString();
            counts[date] = (counts[date] || 0) + 1;

            if (index % 3 === 0) chat++;
            else if (index % 3 === 1) phone++;
            else form++;
        });

        document.getElementById('chatCount').innerText = chat;
        document.getElementById('phoneCount').innerText = phone;
        document.getElementById('formCount').innerText = form;

        leadsChart.data.labels = Object.keys(counts);
        leadsChart.data.datasets[0].data = Object.values(counts);
        leadsChart.update();
    })
    .catch(err => console.log('Erro ao carregar dados', err));
