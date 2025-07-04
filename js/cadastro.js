// Gerenciar seleção do tipo de usuário
const userTypeOptions = document.querySelectorAll('.user-type-option');
const lavadorExtra = document.getElementById('lavador-extra');

userTypeOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remover seleção anterior
        userTypeOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Adicionar seleção atual
        this.classList.add('selected');
        
        // Mostrar/esconder campos extras do lavador
        if (this.dataset.type === 'lavador') {
            lavadorExtra.classList.add('active');
            lavadorExtra.querySelectorAll('input').forEach(input => input.required = true);
        } else {
            lavadorExtra.classList.remove('active');
            lavadorExtra.querySelectorAll('input').forEach(input => input.required = false);
        }
    });
});

// Gerenciar envio do formulário
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        telefone: document.getElementById('telefone').value,
        tipo: document.querySelector('.user-type-option.selected').dataset.type
    };

    if (formData.tipo === 'lavador') {
        formData.cpf = document.getElementById('cpf').value;
        formData.regiao = document.getElementById('regiao').value;
        formData.experiencia = document.getElementById('experiencia').value;
    }

    // Simulação de cadastro (mock)
    console.log('Dados do cadastro:', formData);
    
    // Em produção, aqui seria feita uma chamada à API
    
    // Armazenar dados do usuário (em produção, usar tokens JWT)
    localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        type: formData.tipo
    }));

    // Redirecionar baseado no tipo de usuário
    if (formData.tipo === 'cliente') {
        window.location.href = 'cliente/dashboard.html';
    } else {
        window.location.href = 'lavador/dashboard.html';
    }
}); 