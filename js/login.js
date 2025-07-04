document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulação de login (mock)
    const mockUsers = [
        { email: 'cliente@exemplo.com', password: '123456', type: 'cliente' },
        { email: 'lavador@exemplo.com', password: '123456', type: 'lavador' }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
        // Armazenar dados do usuário (em produção, usar tokens JWT)
        localStorage.setItem('user', JSON.stringify({
            email: user.email,
            type: user.type
        }));

        // Redirecionar baseado no tipo de usuário
        if (user.type === 'cliente') {
            window.location.href = 'cliente/lavadores-disponiveis.html';
        } else {
            window.location.href = 'lavador/dashboard.html';
        }
    } else {
        // Mostrar mensagem de erro no toast
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = 'E-mail ou senha inválidos!';
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}); 