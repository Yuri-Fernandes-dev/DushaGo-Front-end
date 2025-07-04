// Verificar se usuário está logado
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.type !== 'cliente') {
    window.location.href = '../index.html';
}

// Mock de serviços disponíveis
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

// Mock de lavadores disponíveis
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

// Renderizar serviços
const servicesGrid = document.getElementById('servicesGrid');
services.forEach(service => {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card';
    serviceCard.innerHTML = `
        <h3><i class="fas ${service.icon}"></i> ${service.name}</h3>
        <p>${service.description}</p>
        <div class="price">R$ ${service.price.toFixed(2)}</div>
        <button class="btn btn-primary" onclick="solicitarServico(${service.id})">
            Solicitar Serviço
        </button>
    `;
    servicesGrid.appendChild(serviceCard);
});

// Renderizar lavadores
const washersList = document.getElementById('washersList');
washers.forEach(washer => {
    const washerItem = document.createElement('div');
    washerItem.className = 'washer-item';
    washerItem.innerHTML = `
        <div class="washer-info">
            <div class="washer-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="washer-details">
                <h4>${washer.name}</h4>
                <p>${washer.region} • ${washer.rating} ⭐ • ${washer.totalServices} serviços</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="selecionarLavador(${washer.id})">
            Selecionar
        </button>
    `;
    washersList.appendChild(washerItem);
});

// Funções de interação
function solicitarServico(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        // Em produção, aqui abriria um modal de confirmação
        alert(`Serviço selecionado: ${service.name}\nPor favor, selecione um lavador disponível.`);
    }
}

function selecionarLavador(washerId) {
    const washer = washers.find(w => w.id === washerId);
    if (washer) {
        // Em produção, aqui redirecionaria para a tela de agendamento
        window.location.href = `agendamento.html?washer=${washerId}`;
    }
}

// Atualizar nome do usuário
document.getElementById('userName').textContent = user.email.split('@')[0]; 