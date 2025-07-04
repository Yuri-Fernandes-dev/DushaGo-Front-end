// Elementos do DOM
const servicoStep = document.getElementById('servicoStep');
const enderecoStep = document.getElementById('enderecoStep');
const lavadoresStep = document.getElementById('lavadoresStep');
const confirmacaoStep = document.getElementById('confirmacaoStep');
const serviceOptions = document.querySelectorAll('.service-option');
const lavadoresGrid = document.getElementById('lavadoresGrid');
const btnVoltarServico = document.getElementById('btnVoltarServico');
const btnVoltarEndereco = document.getElementById('btnVoltarEndereco');
const btnVoltarLavadores = document.getElementById('btnVoltarLavadores');
const btnBuscarLavadores = document.getElementById('btnBuscarLavadores');
const btnConfirmar = document.getElementById('btnConfirmar');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const loading = document.getElementById('loading');

// Estado da aplicação
let servicoSelecionado = null;
let lavadorSelecionado = null;
let enderecoSelecionado = null;

// Mock de lavadores disponíveis
const mockLavadores = [
    {
        id: 1,
        nome: 'João Silva',
        bairro: 'Centro',
        avaliacao: 4.8,
        totalServicos: 150,
        tempoMedio: '45min',
        servicosHoje: 5
    },
    {
        id: 2,
        nome: 'Maria Santos',
        bairro: 'Jardim América',
        avaliacao: 4.9,
        totalServicos: 200,
        tempoMedio: '40min',
        servicosHoje: 7
    },
    {
        id: 3,
        nome: 'Pedro Oliveira',
        bairro: 'Vila Nova',
        avaliacao: 4.7,
        totalServicos: 120,
        tempoMedio: '50min',
        servicosHoje: 4
    }
];

// Funções
function showStep(step) {
    servicoStep.classList.remove('active');
    enderecoStep.classList.remove('active');
    lavadoresStep.classList.remove('active');
    confirmacaoStep.classList.remove('active');
    step.classList.add('active');
}

function selectService(serviceOption) {
    // Remover seleção anterior
    serviceOptions.forEach(option => option.classList.remove('selected'));
    
    // Adicionar seleção ao serviço clicado
    serviceOption.classList.add('selected');
    
    // Guardar dados do serviço
    servicoSelecionado = {
        tipo: serviceOption.dataset.service,
        nome: serviceOption.querySelector('.service-name').textContent,
        preco: serviceOption.querySelector('.service-price').textContent,
        tempo: serviceOption.querySelector('.service-time span').textContent
    };
    
    // Atualizar resumo do serviço
    document.getElementById('servicoResumo').innerHTML = `
        <div class="service-details">
            <div class="detail-item">
                <strong>Serviço:</strong>
                <span>${servicoSelecionado.nome}</span>
            </div>
            <div class="detail-item">
                <strong>Preço:</strong>
                <span>${servicoSelecionado.preco}</span>
            </div>
            <div class="detail-item">
                <strong>Tempo estimado:</strong>
                <span>${servicoSelecionado.tempo}</span>
            </div>
        </div>
    `;
    
    // Ir para etapa de endereço
    showStep(enderecoStep);
}

function buscarLavadores() {
    const endereco = {
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value
    };

    if (!endereco.rua || !endereco.numero || !endereco.bairro) {
        mostrarToast('Por favor, preencha o endereço completo');
        return;
    }

    enderecoSelecionado = endereco;
    
    // Mostrar loading
    loading.style.display = 'flex';
    
    // Simular busca de lavadores
    setTimeout(() => {
        // Atualizar resumo do serviço
        document.getElementById('servicoSelecionadoResumo').innerHTML = `
            <div class="service-summary-header">
                <h3>${servicoSelecionado.nome}</h3>
                <span class="service-price">${servicoSelecionado.preco}</span>
            </div>
            <div class="service-summary-address">
                <i class="fas fa-map-marker-alt"></i>
                <span>${endereco.rua}, ${endereco.numero} - ${endereco.bairro}</span>
            </div>
        `;
        
        // Renderizar lavadores
        renderizarLavadores(mockLavadores);
        
        // Esconder loading e mostrar próxima etapa
        loading.style.display = 'none';
        showStep(lavadoresStep);
    }, 1500);
}

function renderizarLavadores(lavadores) {
    lavadoresGrid.innerHTML = '';
    
    lavadores.forEach(lavador => {
        const card = document.createElement('div');
        card.className = 'lavador-card';
        card.onclick = () => selecionarLavador(lavador);
        
        card.innerHTML = `
            <div class="disponivel-badge">
                <i class="fas fa-check-circle"></i>
                DISPONÍVEL AGORA
            </div>
            <div class="lavador-header">
                <div class="lavador-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="lavador-info">
                    <h3>${lavador.nome}</h3>
                    <p>${lavador.bairro}</p>
                </div>
            </div>
            <div class="lavador-rating">
                <div class="rating-stars">
                    ${'★'.repeat(Math.floor(lavador.avaliacao))}${lavador.avaliacao % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(lavador.avaliacao))}
                </div>
                <span>${lavador.avaliacao.toFixed(1)}</span>
            </div>
            <div class="lavador-stats">
                <div class="stat-item">
                    <div class="stat-value">${lavador.totalServicos}</div>
                    <div class="stat-label">Lavagens</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${lavador.tempoMedio}</div>
                    <div class="stat-label">Tempo médio</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${lavador.servicosHoje}</div>
                    <div class="stat-label">Hoje</div>
                </div>
            </div>
        `;
        
        lavadoresGrid.appendChild(card);
    });
}

function selecionarLavador(lavador) {
    lavadorSelecionado = lavador;
    
    // Preencher resumo do pedido
    document.getElementById('pedidoResumo').innerHTML = `
        <div class="order-details">
            <div class="detail-section">
                <h4>Serviço</h4>
                <div class="detail-item">
                    <span>${servicoSelecionado.nome}</span>
                    <span>${servicoSelecionado.preco}</span>
                </div>
                <div class="detail-item">
                    <small>Tempo estimado: ${servicoSelecionado.tempo}</small>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Lavador</h4>
                <div class="detail-item">
                    <span>${lavador.nome}</span>
                    <div class="rating-stars small">
                        ${'★'.repeat(Math.floor(lavador.avaliacao))}${lavador.avaliacao % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(lavador.avaliacao))}
                        <span>${lavador.avaliacao.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Endereço</h4>
                <div class="detail-item">
                    <span>${enderecoSelecionado.rua}, ${enderecoSelecionado.numero}</span>
                </div>
                <div class="detail-item">
                    <span>${enderecoSelecionado.bairro}</span>
                </div>
                ${enderecoSelecionado.complemento ? `
                <div class="detail-item">
                    <small>Complemento: ${enderecoSelecionado.complemento}</small>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    showStep(confirmacaoStep);
}

function confirmarSolicitacao() {
    loading.style.display = 'flex';
    
    // Simular envio da solicitação
    setTimeout(() => {
        loading.style.display = 'none';
        mostrarToast('Solicitação enviada! Aguarde a confirmação do lavador');
        
        // Voltar para a seleção de serviço
        setTimeout(() => {
            showStep(servicoStep);
            // Limpar seleções
            serviceOptions.forEach(option => option.classList.remove('selected'));
            servicoSelecionado = null;
            lavadorSelecionado = null;
            enderecoSelecionado = null;
            // Limpar formulário
            document.getElementById('rua').value = '';
            document.getElementById('numero').value = '';
            document.getElementById('complemento').value = '';
            document.getElementById('bairro').value = '';
        }, 2000);
    }, 1500);
}

function mostrarToast(mensagem, duracao = 3000) {
    toastMessage.textContent = mensagem;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duracao);
}

// Event Listeners
serviceOptions.forEach(option => {
    option.addEventListener('click', () => selectService(option));
});

btnVoltarServico.addEventListener('click', () => {
    showStep(servicoStep);
});

btnVoltarEndereco.addEventListener('click', () => {
    showStep(enderecoStep);
});

btnVoltarLavadores.addEventListener('click', () => {
    showStep(lavadoresStep);
});

btnBuscarLavadores.addEventListener('click', buscarLavadores);
btnConfirmar.addEventListener('click', confirmarSolicitacao);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarLavadores(mockLavadores);
}); 