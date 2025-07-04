// Elementos do DOM - Referências aos elementos HTML que vamos manipular
const sidebar = document.getElementById('sidebar');
const sidebarCollapse = document.getElementById('sidebarCollapse');
const content = document.getElementById('content');

// Variável global para armazenar a instância do gráfico
let lavangesChart = null;

// Dados fixos para o gráfico
const dadosLavagens = {
    labels: ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
    valores: [2, 5, 8, 12, 15, 10, 8, 5, 2]
};

// Função para criar o gráfico
function initializeChart() {
    const ctx = document.getElementById('lavangesChart');
    if (!ctx) return;

    // Se já existe um gráfico, destrua-o
    if (lavangesChart) {
        lavangesChart.destroy();
    }

    // Configuração do gráfico
    const config = {
        type: 'line',
        data: {
            labels: dadosLavagens.labels,
            datasets: [{
                label: 'Lavagens por Hora',
                data: dadosLavagens.valores,
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Desativa animações
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Total de Lavagens: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20, // Define um limite máximo fixo
                    grid: {
                        display: true,
                        color: '#f0f0f0'
                    },
                    ticks: {
                        stepSize: 5,
                        callback: function(value) {
                            return value + ' lavagens';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    // Cria o novo gráfico
    lavangesChart = new Chart(ctx, config);
}

// Toggle do Sidebar - Controla a abertura/fechamento do menu lateral
sidebarCollapse?.addEventListener('click', () => {
    sidebar?.classList.toggle('active');
});

// Funções de Utilidade para formatação de dados
function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Sistema de Notificações
let notifications = [];

// Adiciona uma nova notificação
function addNotification(title, message, type = 'info') {
    const notification = {
        id: Date.now(),
        title,
        message,
        type,
        read: false,
        timestamp: new Date()
    };
    
    notifications.unshift(notification);
    updateNotificationBadge();
    showToast(`Nova notificação: ${title}`);
}

// Atualiza o contador de notificações não lidas
function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notifications .badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Sistema de Toast (mensagens temporárias)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
    toast.style.color = 'white';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '9999';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Dados mockados para o dashboard
const mockData = {
    totalLavagens: 48,
    faturamento: 2450,
    lavadoresOnline: 27,
    avaliacaoMedia: 4.8,
    ultimasAtividades: [
        {
            id: 1234,
            cliente: 'Ana Silva',
            lavador: 'Carlos Santos',
            servico: 'Lavagem Completa',
            valor: 80,
            status: 'Concluído'
        }
    ]
};

// Atualiza os elementos do dashboard com os dados recebidos
function updateDashboard(data) {
    // Atualiza os cards com os valores
    const elements = {
        totalLavagens: document.querySelector('#totalLavagens'),
        faturamento: document.querySelector('#faturamento'),
        lavadoresOnline: document.querySelector('#lavadoresOnline'),
        avaliacaoMedia: document.querySelector('#avaliacaoMedia')
    };

    if (elements.totalLavagens) elements.totalLavagens.textContent = data.totalLavagens;
    if (elements.faturamento) elements.faturamento.textContent = formatMoney(data.faturamento);
    if (elements.lavadoresOnline) elements.lavadoresOnline.textContent = data.lavadoresOnline;
    if (elements.avaliacaoMedia) elements.avaliacaoMedia.textContent = data.avaliacaoMedia.toFixed(1);
    
    // Atualiza a tabela de atividades
    updateActivityTable(data.ultimasAtividades);
}

// Atualiza a tabela de atividades recentes
function updateActivityTable(activities) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = activities.map(activity => `
        <tr>
            <td>#${activity.id}</td>
            <td>${activity.cliente}</td>
            <td>${activity.lavador}</td>
            <td>${activity.servico}</td>
            <td>${formatMoney(activity.valor)}</td>
            <td><span class="badge bg-${getStatusColor(activity.status)}">${activity.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Retorna a cor do badge baseado no status
function getStatusColor(status) {
    const colors = {
        'Concluído': 'success',
        'Em andamento': 'warning',
        'Cancelado': 'danger',
        'Pendente': 'info'
    };
    return colors[status] || 'secondary';
}

// Inicialização do Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os tooltips do Bootstrap
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    
    // Inicializa o gráfico uma única vez
    initializeChart();
    
    // Carrega os dados iniciais uma única vez
    updateDashboard(mockData);
    
    // Controle do Menu
    initializeMenu();
});

// Inicialização e controle do menu
function initializeMenu() {
    // Marca o item atual do menu como ativo
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('#sidebar .nav-link');
    
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.parentElement.classList.add('active');
            
            // Se estiver em um submenu, expande o menu pai
            const submenu = link.closest('.submenu');
            if (submenu) {
                submenu.classList.add('show');
                const parentLink = submenu.previousElementSibling;
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });

    // Controle de submenus
    const submenuToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const submenuId = toggle.getAttribute('href');
            const submenu = document.querySelector(submenuId);
            
            // Fecha outros submenus abertos
            const openSubmenus = document.querySelectorAll('.submenu.show');
            openSubmenus.forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.remove('show');
                    const parentLink = menu.previousElementSibling;
                    if (parentLink) {
                        parentLink.classList.remove('active');
                    }
                }
            });

            // Toggle do submenu atual
            toggle.classList.toggle('active');
            
            // Rotaciona o ícone de seta
            const arrow = toggle.querySelector('.fa-chevron-down');
            if (arrow) {
                arrow.style.transform = submenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
            }
        });
    });

    // Controle do botão de toggle do menu em dispositivos móveis
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapse && sidebar) {
        sidebarCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Fecha o menu ao clicar fora em dispositivos móveis
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleButton = sidebarCollapse.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnToggleButton && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
} 