// Elementos do DOM
const userTable = document.querySelector('.table');
const selectAllCheckbox = document.getElementById('selectAll');
const addUserForm = document.getElementById('addUserForm');
const searchForm = document.querySelector('form');

// Estado
let users = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalUsers = 0;

// Funções de Utilidade
function formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Gerenciamento de Usuários
async function fetchUsers(page = 1, filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit: itemsPerPage,
            ...filters
        });

        const response = await fetch(`/api/admin/users?${queryParams}`);
        const data = await response.json();
        
        users = data.users;
        totalUsers = data.total;
        
        renderUsers();
        updatePagination();
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        showToast('Erro ao carregar usuários', 'error');
    }
}

function renderUsers() {
    const tbody = userTable.querySelector('tbody');
    tbody.innerHTML = users.map(user => `
        <tr data-user-id="${user.id}">
            <td>
                <div class="form-check">
                    <input class="form-check-input user-select" type="checkbox">
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${user.avatar || 'https://via.placeholder.com/32'}" class="rounded-circle me-2" alt="">
                    <div>
                        <div class="fw-bold">${user.name}</div>
                        <small class="text-muted">${formatPhone(user.phone)}</small>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="badge bg-${getTypeColor(user.type)}">${user.type}</span></td>
            <td><span class="badge bg-${getStatusColor(user.status)}">${user.status}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})" data-bs-toggle="tooltip" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})" data-bs-toggle="tooltip" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="toggleUserStatus(${user.id})" data-bs-toggle="tooltip" title="Bloquear">
                        <i class="fas fa-ban"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Reinicializar tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

function getTypeColor(type) {
    const colors = {
        'cliente': 'info',
        'lavador': 'primary',
        'admin': 'dark'
    };
    return colors[type] || 'secondary';
}

function getStatusColor(status) {
    const colors = {
        'ativo': 'success',
        'inativo': 'secondary',
        'bloqueado': 'danger'
    };
    return colors[status] || 'secondary';
}

function updatePagination() {
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    
    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;

    pagination.innerHTML = html;
}

async function changePage(page) {
    if (page < 1 || page > Math.ceil(totalUsers / itemsPerPage)) return;
    currentPage = page;
    await fetchUsers(page, getFilters());
}

// Gerenciamento de Seleção
selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.user-select');
    checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
});

// Ações em Lote
function getSelectedUsers() {
    const checkboxes = document.querySelectorAll('.user-select:checked');
    return Array.from(checkboxes).map(checkbox => 
        checkbox.closest('tr').dataset.userId
    );
}

async function deleteSelectedUsers() {
    const selectedUsers = getSelectedUsers();
    if (!selectedUsers.length) {
        showToast('Selecione pelo menos um usuário', 'warning');
        return;
    }

    if (!confirm(`Deseja excluir ${selectedUsers.length} usuário(s)?`)) return;

    try {
        await fetch('/api/admin/users/batch', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: selectedUsers })
        });

        showToast('Usuários excluídos com sucesso');
        fetchUsers(currentPage, getFilters());
    } catch (error) {
        console.error('Erro ao excluir usuários:', error);
        showToast('Erro ao excluir usuários', 'error');
    }
}

// Formulário de Adição
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addUserForm);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Erro ao adicionar usuário');

        showToast('Usuário adicionado com sucesso');
        addUserForm.reset();
        bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
        fetchUsers(currentPage, getFilters());
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        showToast('Erro ao adicionar usuário', 'error');
    }
});

// Filtros
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentPage = 1;
    await fetchUsers(1, getFilters());
});

function getFilters() {
    const formData = new FormData(searchForm);
    const filters = {};

    for (const [key, value] of formData.entries()) {
        if (value) filters[key] = value;
    }

    return filters;
}

// Ações Individuais
async function editUser(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}`);
        const user = await response.json();
        
        // Preencher formulário de edição
        // Implementar modal de edição
        showToast('Função em desenvolvimento');
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        showToast('Erro ao carregar dados do usuário', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Deseja excluir este usuário?')) return;

    try {
        await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        });

        showToast('Usuário excluído com sucesso');
        fetchUsers(currentPage, getFilters());
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showToast('Erro ao excluir usuário', 'error');
    }
}

async function toggleUserStatus(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
            method: 'PUT'
        });
        
        if (!response.ok) throw new Error('Erro ao alterar status');

        showToast('Status alterado com sucesso');
        fetchUsers(currentPage, getFilters());
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        showToast('Erro ao alterar status do usuário', 'error');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
}); 