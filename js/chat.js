// Verificar se usuário está logado
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'index.html';
}

// Mock de dados do chat
const chatData = {
    cliente: {
        id: 1,
        name: 'Ana Silva',
        type: 'cliente'
    },
    lavador: {
        id: 2,
        name: 'João Silva',
        type: 'lavador'
    },
    service: {
        tipo: 'Lavagem Completa',
        data: '2024-02-20T14:00:00',
        endereco: 'Rua das Flores, 123 - Jardim Primavera'
    },
    messages: [
        {
            id: 1,
            sender: 'cliente',
            text: 'Olá! Tudo bem? Gostaria de confirmar se você está a caminho.',
            time: '2024-02-20T13:45:00'
        },
        {
            id: 2,
            sender: 'lavador',
            text: 'Oi! Sim, estou a caminho. Chego em aproximadamente 10 minutos.',
            time: '2024-02-20T13:46:00'
        },
        {
            id: 3,
            sender: 'cliente',
            text: 'Ótimo! O portão está aberto, pode entrar quando chegar.',
            time: '2024-02-20T13:46:30'
        }
    ]
};

// Atualizar informações do chat
const otherUser = user.type === 'cliente' ? chatData.lavador : chatData.cliente;
document.getElementById('chatName').textContent = otherUser.name;

// Atualizar detalhes do serviço
const dataFormatada = new Date(chatData.service.data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

document.getElementById('serviceDetails').innerHTML = `
    ${chatData.service.tipo} • ${dataFormatada}
    <br>
    ${chatData.service.endereco}
`;

// Renderizar mensagens
const chatMessages = document.getElementById('chatMessages');

function renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === user.type ? 'sent' : 'received'}`;
    
    const time = new Date(message.time).toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageElement.innerHTML = `
        ${message.text}
        <div class="time">${time}</div>
    `;

    chatMessages.appendChild(messageElement);
}

// Renderizar mensagens existentes
chatData.messages.forEach(renderMessage);

// Rolar para a última mensagem
chatMessages.scrollTop = chatMessages.scrollHeight;

// Gerenciar envio de mensagens
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text) {
        const newMessage = {
            id: chatData.messages.length + 1,
            sender: user.type,
            text: text,
            time: new Date().toISOString()
        };

        // Em produção, aqui seria feita uma chamada à API
        chatData.messages.push(newMessage);
        renderMessage(newMessage);
        
        // Limpar input e rolar para a última mensagem
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// Simular recebimento de mensagens (para demonstração)
setTimeout(() => {
    const response = {
        id: chatData.messages.length + 1,
        sender: otherUser.type,
        text: 'Mensagem automática de demonstração.',
        time: new Date().toISOString()
    };
    
    chatData.messages.push(response);
    renderMessage(response);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}, 5000); 