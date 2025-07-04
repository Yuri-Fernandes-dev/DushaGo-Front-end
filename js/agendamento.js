// Verificar se usuário está logado
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.type !== 'cliente') {
    window.location.href = '../index.html';
}

// Obter ID do lavador da URL
const urlParams = new URLSearchParams(window.location.search);
const washerId = parseInt(urlParams.get('washer'));

// Mock de lavadores (mesmo do dashboard)
const washers = [
    {
        id: 1,
        name: 'João Silva',
        region: 'Zona Sul',
        rating: 4.8,
        totalServices: 150
    },
    {
        id: 2,
        name: 'Maria Santos',
        region: 'Zona Norte',
        rating: 4.9,
        totalServices: 200
    },
    {
        id: 3,
        name: 'Pedro Oliveira',
        region: 'Centro',
        rating: 4.7,
        totalServices: 120
    }
];

// Mock de serviços (mesmo do dashboard)
const services = [
    {
        id: 1,
        name: 'Lavagem Simples',
        description: 'Lavagem externa completa, incluindo rodas e pneus',
        price: 50.00,
        icon: 'fa-car'
    },
    {
        id: 2,
        name: 'Lavagem Completa',
        description: 'Lavagem externa e interna, incluindo aspiração e limpeza do painel',
        price: 80.00,
        icon: 'fa-car-side'
    },
    {
        id: 3,
        name: 'Lavagem Premium',
        description: 'Lavagem completa com enceramento e hidratação dos bancos',
        price: 120.00,
        icon: 'fa-car-rear'
    }
];

// Encontrar lavador selecionado
const selectedWasher = washers.find(w => w.id === washerId);
if (!selectedWasher) {
    window.location.href = 'dashboard.html';
}

// Preencher informações do lavador
const washerInfo = document.getElementById('washerInfo');
washerInfo.innerHTML = `
    <div class="washer-info">
        <div class="washer-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="washer-details">
            <h4>${selectedWasher.name}</h4>
            <p>${selectedWasher.region} • ${selectedWasher.rating} ⭐ • ${selectedWasher.totalServices} serviços</p>
        </div>
    </div>
`;

// Atualizar nome do lavador no resumo
document.getElementById('washerName').textContent = selectedWasher.name;

// Configurar data mínima como hoje
const today = new Date().toISOString().split('T')[0];
document.getElementById('data').min = today;

// Atualizar resumo quando data/hora são alterados
function updateSummary() {
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    
    if (data && hora) {
        const dataFormatada = new Date(data + 'T' + hora).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('summaryDate').textContent = dataFormatada;
    }
}

document.getElementById('data').addEventListener('change', updateSummary);
document.getElementById('hora').addEventListener('change', updateSummary);

// Gerenciar envio do formulário
document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        lavador: selectedWasher,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        endereco: {
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value
        },
        servico: services[1], // Usando Lavagem Completa como padrão
        cliente: user
    };

    // Em produção, aqui seria feita uma chamada à API
    console.log('Dados do agendamento:', formData);

    // Simular sucesso e redirecionar
    alert('Agendamento realizado com sucesso!');
    window.location.href = 'dashboard.html';
}); 