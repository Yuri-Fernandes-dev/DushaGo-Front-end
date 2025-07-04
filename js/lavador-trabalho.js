// Verificar se usuário está logado
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.type !== 'lavador') {
    window.location.href = '../index.html';
}

// Elementos do DOM
const statusIndicator = document.getElementById('statusIndicator');
const btnToggleStatus = document.getElementById('btnToggleStatus');
const solicitacoesSection = document.getElementById('solicitacoesSection');
const solicitacoesList = document.getElementById('solicitacoesList');
const servicoAtualSection = document.getElementById('servicoAtualSection');
const servicoAtualInfo = document.getElementById('servicoAtualInfo');
const btnFinalizarServico = document.getElementById('btnFinalizarServico');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const notificationSound = document.getElementById('notificationSound');

// Estado do lavador
let isOnline = false;
let servicoAtual = null;
let checkSolicitacoesInterval = null;

// Mock de solicitações que podem chegar
const mockSolicitacoes = [
    {
        id: 1,
        cliente: {
            nome: 'Ana Silva',
            bairro: 'Centro'
        },
        servico: 'Lavagem Completa',
        endereco: 'Rua das Flores, 123 - Centro',
        valor: 80.00,
        timestamp: new Date().toISOString()
    },
    {
        id: 2,
        cliente: {
            nome: 'Carlos Santos',
            bairro: 'Jardim América'
        },
        servico: 'Lavagem Premium',
        endereco: 'Av. Principal, 456 - Jardim América',
        valor: 120.00,
        timestamp: new Date().toISOString()
    }
];

// Funções
function toggleStatus() {
    isOnline = !isOnline;
    
    if (isOnline) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusIndicator.querySelector('.status-text h2').textContent = 'Você está Online';
        statusIndicator.querySelector('.status-text p').textContent = 'Pronto para receber solicitações';
        statusIndicator.querySelector('.status-icon i').className = 'fas fa-check-circle';
        btnToggleStatus.textContent = 'Ficar Indisponível';
        btnToggleStatus.classList.add('btn-danger');
        
        // Iniciar verificação de solicitações
        iniciarVerificacaoSolicitacoes();
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusIndicator.querySelector('.status-text h2').textContent = 'Você está Offline';
        statusIndicator.querySelector('.status-text p').textContent = 'Fique online para receber solicitações';
        statusIndicator.querySelector('.status-icon i').className = 'fas fa-power-off';
        btnToggleStatus.textContent = 'Ficar Disponível';
        btnToggleStatus.classList.remove('btn-danger');
        
        // Parar verificação de solicitações
        pararVerificacaoSolicitacoes();
        
        // Esconder seção de solicitações
        solicitacoesSection.style.display = 'none';
    }
}

function iniciarVerificacaoSolicitacoes() {
    // Simular chegada de solicitações a cada 10 segundos
    checkSolicitacoesInterval = setInterval(() => {
        if (!servicoAtual && Math.random() > 0.5) {
            const solicitacao = mockSolicitacoes[Math.floor(Math.random() * mockSolicitacoes.length)];
            mostrarSolicitacao(solicitacao);
        }
    }, 10000);
}

function pararVerificacaoSolicitacoes() {
    if (checkSolicitacoesInterval) {
        clearInterval(checkSolicitacoesInterval);
        checkSolicitacoesInterval = null;
    }
}

function mostrarSolicitacao(solicitacao) {
    // Tocar som de notificação
    notificationSound.play();
    
    // Mostrar seção de solicitações
    solicitacoesSection.style.display = 'block';
    
    // Criar card da solicitação
    const card = document.createElement('div');
    card.className = 'solicitacao-card new';
    card.innerHTML = `
        <div class="solicitacao-header">
            <div class="cliente-info">
                <div class="cliente-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="cliente-details">
                    <h3>${solicitacao.cliente.nome}</h3>
                    <p>${solicitacao.cliente.bairro}</p>
                </div>
            </div>
            <div class="timestamp">
                ${new Date(solicitacao.timestamp).toLocaleTimeString()}
            </div>
        </div>
        <div class="solicitacao-body">
            <div class="solicitacao-info">
                <div class="info-item">
                    <i class="fas fa-car"></i>
                    <span>${solicitacao.servico}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${solicitacao.endereco}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>R$ ${solicitacao.valor.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div class="solicitacao-actions">
            <button class="btn btn-success" onclick="aceitarSolicitacao(${solicitacao.id})">
                <i class="fas fa-check"></i>
                Aceitar
            </button>
            <button class="btn btn-danger" onclick="recusarSolicitacao(${solicitacao.id})">
                <i class="fas fa-times"></i>
                Recusar
            </button>
        </div>
    `;
    
    solicitacoesList.appendChild(card);
}

function aceitarSolicitacao(id) {
    const solicitacao = mockSolicitacoes.find(s => s.id === id);
    if (solicitacao) {
        servicoAtual = solicitacao;
        
        // Esconder seção de solicitações
        solicitacoesSection.style.display = 'none';
        
        // Mostrar seção de serviço atual
        servicoAtualSection.style.display = 'block';
        servicoAtualInfo.innerHTML = `
            <div class="cliente-info">
                <div class="cliente-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="cliente-details">
                    <h3>${solicitacao.cliente.nome}</h3>
                    <p>${solicitacao.cliente.bairro}</p>
                </div>
            </div>
            <div class="solicitacao-info">
                <div class="info-item">
                    <i class="fas fa-car"></i>
                    <span>${solicitacao.servico}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${solicitacao.endereco}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>R$ ${solicitacao.valor.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        mostrarToast('Serviço aceito! Dirija-se ao endereço do cliente.');
    }
}

function recusarSolicitacao(id) {
    const card = solicitacoesList.querySelector(`[onclick*="${id}"]`).closest('.solicitacao-card');
    if (card) {
        card.remove();
    }
    
    if (solicitacoesList.children.length === 0) {
        solicitacoesSection.style.display = 'none';
    }
    
    mostrarToast('Solicitação recusada.');
}

function finalizarServico() {
    if (servicoAtual) {
        servicoAtual = null;
        servicoAtualSection.style.display = 'none';
        mostrarToast('Serviço finalizado com sucesso!');
    }
}

function mostrarToast(mensagem, duracao = 3000) {
    toastMessage.textContent = mensagem;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duracao);
}

// Event Listeners
btnToggleStatus.addEventListener('click', toggleStatus);
btnFinalizarServico.addEventListener('click', finalizarServico);

// Atualizar nome do usuário
document.getElementById('userName').textContent = user.email.split('@')[0]; 