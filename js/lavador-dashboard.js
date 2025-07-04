// Verificar se usuário está logado
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.type !== 'lavador') {
    window.location.href = '../index.html';
}

// Mock de dados do lavador
const lavadorData = {
    saldoSemanal: 450.00,
    servicosRealizados: 15,
    avaliacao: 4.8
};

// Mock de solicitações
const solicitacoes = [
    {
        id: 1,
        cliente: 'Ana Silva',
        servico: 'Lavagem Completa',
        data: '2024-02-20T14:00:00',
        endereco: 'Rua das Flores, 123 - Jardim Primavera',
        valor: 80.00
    },
    {
        id: 2,
        cliente: 'Carlos Santos',
        servico: 'Lavagem Premium',
        data: '2024-02-20T16:30:00',
        endereco: 'Av. Principal, 456 - Centro',
        valor: 120.00
    }
];

// Mock de histórico
const historico = [
    {
        id: 1,
        cliente: 'João Pedro',
        servico: 'Lavagem Simples',
        data: '2024-02-19T10:00:00',
        valor: 50.00,
        status: 'completed',
        avaliacao: 5
    },
    {
        id: 2,
        cliente: 'Maria Oliveira',
        servico: 'Lavagem Completa',
        data: '2024-02-18T15:00:00',
        valor: 80.00,
        status: 'completed',
        avaliacao: 4
    },
    {
        id: 3,
        cliente: 'Pedro Santos',
        servico: 'Lavagem Premium',
        data: '2024-02-18T09:00:00',
        valor: 120.00,
        status: 'cancelled',
        motivo: 'Cliente cancelou'
    }
];

// Atualizar estatísticas
document.getElementById('saldoSemanal').textContent = `R$ ${lavadorData.saldoSemanal.toFixed(2)}`;
document.getElementById('servicosRealizados').textContent = lavadorData.servicosRealizados;
document.getElementById('avaliacao').textContent = lavadorData.avaliacao.toFixed(1);

// Atualizar nome do usuário
document.getElementById('userName').textContent = user.email.split('@')[0];

// Renderizar solicitações
const requestsList = document.querySelector('.requests-list');
solicitacoes.forEach(solicitacao => {
    const dataFormatada = new Date(solicitacao.data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    requestItem.innerHTML = `
        <div class="request-info">
            <h4>${solicitacao.cliente}</h4>
            <p>${solicitacao.servico}</p>
            <p><i class="fas fa-calendar"></i> ${dataFormatada}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${solicitacao.endereco}</p>
            <p><i class="fas fa-money-bill-wave"></i> R$ ${solicitacao.valor.toFixed(2)}</p>
        </div>
        <div class="request-actions">
            <button class="btn btn-accept" onclick="aceitarSolicitacao(${solicitacao.id})">
                <i class="fas fa-check"></i> Aceitar
            </button>
            <button class="btn btn-reject" onclick="recusarSolicitacao(${solicitacao.id})">
                <i class="fas fa-times"></i> Recusar
            </button>
        </div>
    `;
    requestsList.appendChild(requestItem);
});

// Renderizar histórico
const historyList = document.querySelector('.history-list');
historico.forEach(item => {
    const dataFormatada = new Date(item.data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="request-info">
            <h4>${item.cliente}</h4>
            <p>${item.servico}</p>
            <p><i class="fas fa-calendar"></i> ${dataFormatada}</p>
            <p><i class="fas fa-money-bill-wave"></i> R$ ${item.valor.toFixed(2)}</p>
            ${item.status === 'completed' ? 
                `<p><i class="fas fa-star"></i> Avaliação: ${item.avaliacao}/5</p>` : 
                `<p><i class="fas fa-info-circle"></i> Motivo: ${item.motivo}</p>`
            }
        </div>
        <span class="status-badge status-${item.status}">
            ${item.status === 'completed' ? 'Concluído' : 'Cancelado'}
        </span>
    `;
    historyList.appendChild(historyItem);
});

// Gerenciar tabs
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover classe active de todas as tabs
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => {
            c.style.display = 'none';
            c.classList.remove('active');
        });

        // Adicionar classe active na tab clicada
        tab.classList.add('active');
        const tabId = tab.dataset.tab;
        const content = document.getElementById(tabId);
        content.style.display = 'block';
        content.classList.add('active');
    });
});

// Funções de interação
function aceitarSolicitacao(id) {
    // Em produção, aqui seria feita uma chamada à API
    console.log('Solicitação aceita:', id);
    alert('Solicitação aceita com sucesso!');
    location.reload();
}

function recusarSolicitacao(id) {
    // Em produção, aqui seria feita uma chamada à API
    console.log('Solicitação recusada:', id);
    alert('Solicitação recusada!');
    location.reload();
}

// Elementos do DOM
const btnMenu = document.getElementById('btnMenu');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const btnStatus = document.getElementById('toggleDisponivel');
const statusIndicator = document.getElementById('statusIndicator');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Estado do lavador
let isOnline = false;

// Funções de utilidade
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Controle do Menu
function toggleMenu() {
    sideMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = sideMenu.classList.contains('active') ? 'hidden' : '';
}

// API Endpoints
const API_URL = 'http://localhost:3000/api'; // Ajuste para a URL correta do seu backend

// Funções de API
async function updateLavadorStatus(novoStatus) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/lavador/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ online: novoStatus })
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar status');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
    }
}

async function getLavadorStatus() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/lavador/status`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao obter status');
        }

        const data = await response.json();
        return data.online;
    } catch (error) {
        console.error('Erro ao obter status:', error);
        throw error;
    }
}

// Controle do Status
async function toggleStatus() {
    const btnText = btnStatus.querySelector('.status-text');
    const originalText = btnText.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        btnStatus.disabled = true;
        btnText.textContent = 'Atualizando...';
        
        // Tenta atualizar o status no backend
        const novoStatus = !isOnline;
        await updateLavadorStatus(novoStatus);
        
        // Se chegou aqui, deu tudo certo
        isOnline = novoStatus;
        
        // Atualiza o botão
        btnStatus.classList.toggle('offline', !isOnline);
        const statusText = isOnline ? 'Ficar Offline' : 'Ficar Online';
        const statusIcon = `<div class="status-icon"><i class="fas fa-power-off"></i></div>`;
        btnStatus.innerHTML = `${statusIcon}<span class="status-text">${statusText}</span>`;
        
        // Atualiza o indicador
        statusIndicator.classList.toggle('online', isOnline);
        statusIndicator.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>${isOnline ? 'Online' : 'Offline'}</span>
        `;
        
        showToast(isOnline ? 'Você está online e disponível para receber lavagens!' : 'Você está offline');
    } catch (error) {
        // Se der erro, mantém o status anterior
        showToast('Não foi possível atualizar seu status. Tente novamente.');
        btnStatus.innerHTML = `
            <div class="status-icon"><i class="fas fa-power-off"></i></div>
            <span class="status-text">${originalText}</span>
        `;
    } finally {
        // Sempre reabilita o botão
        btnStatus.disabled = false;
    }
}

// Event Listeners
btnMenu.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);
btnStatus.addEventListener('click', toggleStatus);

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verifica se há um usuário logado
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../index.html';
            return;
        }

        // Atualizar data
        const currentDate = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('pt-BR', options);
        
        // Busca o status atual do lavador no backend
        isOnline = await getLavadorStatus();
        
        // Inicializa o estado do botão e indicador
        btnStatus.classList.toggle('offline', !isOnline);
        statusIndicator.classList.toggle('online', isOnline);
        
        // Atualiza os textos
        const statusText = isOnline ? 'Ficar Offline' : 'Ficar Online';
        const statusIcon = `<div class="status-icon"><i class="fas fa-power-off"></i></div>`;
        btnStatus.innerHTML = `${statusIcon}<span class="status-text">${statusText}</span>`;
        statusIndicator.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>${isOnline ? 'Online' : 'Offline'}</span>
        `;
    } catch (error) {
        console.error('Erro ao inicializar:', error);
        showToast('Erro ao carregar seus dados. Tente recarregar a página.');
    }
}); 