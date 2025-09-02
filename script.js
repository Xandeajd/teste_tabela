// script.js
// Arrays para armazenar os dados
let accounts = [];
let extraIncome = [];

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Configurar event listeners
    document.getElementById('addAccountBtn').addEventListener('click', addAccount);
    document.getElementById('addIncomeBtn').addEventListener('click', addIncome);
    document.getElementById('salary').addEventListener('change', updateSummary);
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    
    // Configurar mês e ano atual
    const now = new Date();
    document.getElementById('month').value = now.getMonth();
    document.getElementById('year').value = now.getFullYear();
    
    // Carregar dados salvos (se existirem)
    // loadSavedData();
    
    // // Inicializar com alguns exemplos se não houver dados salvos
    // if (accounts.length === 0) {
    //     accounts = [
    //         { name: 'Aluguel', value: 1200 },
    //         { name: 'Supermercado', value: 450 },
    //         { name: 'Internet', value: 99.9 }
    //     ];
    // }
    
    // if (extraIncome.length === 0) {
    //     extraIncome = [
    //         { description: 'Freelance', value: 500 },
    //         { description: 'Vendas online', value: 150 }
    //     ];
    // }
    
    if (!document.getElementById('salary').value) {
        document.getElementById('salary').value = 3000;
    }
    
    // Atualizar as tabelas e o resumo
    updateAccountsTable();
    updateIncomeTable();
    updateSummary();
});

// Função para formatar valores monetários
function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Função para adicionar uma conta
function addAccount() {
    const nameInput = document.getElementById('accountName');
    const valueInput = document.getElementById('accountValue');
    
    const name = nameInput.value.trim();
    const value = parseFloat(valueInput.value);
    
    if (name && !isNaN(value) && value > 0) {
        accounts.push({ name, value });
        updateAccountsTable();
        updateSummary();
        saveData();
        
        // Limpar os campos
        nameInput.value = '';
        valueInput.value = '';
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Função para adicionar renda extra
function addIncome() {
    const descInput = document.getElementById('incomeDescription');
    const valueInput = document.getElementById('incomeValue');
    
    const description = descInput.value.trim();
    const value = parseFloat(valueInput.value);
    
    if (description && !isNaN(value) && value > 0) {
        extraIncome.push({ description, value });
        updateIncomeTable();
        updateSummary();
        saveData();
        
        // Limpar os campos
        descInput.value = '';
        valueInput.value = '';
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Função para atualizar a tabela de contas
function updateAccountsTable() {
    const tableBody = document.getElementById('accountsTableBody');
    tableBody.innerHTML = '';
    
    accounts.forEach((account, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${account.name}</td>
            <td>${formatMoney(account.value)}</td>
            <td class="actions">
                <button class="btn-delete" data-index="${index}">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar event listeners aos botões de excluir
    document.querySelectorAll('#accountsTableBody .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteAccount(index);
        });
    });
}

// Função para atualizar a tabela de renda extra
function updateIncomeTable() {
    const tableBody = document.getElementById('incomeTableBody');
    tableBody.innerHTML = '';
    
    extraIncome.forEach((income, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${income.description}</td>
            <td>${formatMoney(income.value)}</td>
            <td class="actions">
                <button class="btn-delete" data-index="${index}">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar event listeners aos botões de excluir
    document.querySelectorAll('#incomeTableBody .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteIncome(index);
        });
    });
}

// Função para excluir uma conta
function deleteAccount(index) {
    accounts.splice(index, 1);
    updateAccountsTable();
    updateSummary();
    saveData();
}

// Função para excluir uma renda extra
function deleteIncome(index) {
    extraIncome.splice(index, 1);
    updateIncomeTable();
    updateSummary();
    saveData();
}

// Função para atualizar o resumo financeiro
function updateSummary() {
    const totalAccounts = accounts.reduce((sum, account) => sum + account.value, 0);
    const totalIncome = extraIncome.reduce((sum, income) => sum + income.value, 0);
    const salary = parseFloat(document.getElementById('salary').value) || 0;
    
    const finalBalance = salary - totalAccounts + totalIncome;
    
    document.getElementById('totalAccounts').textContent = formatMoney(totalAccounts);
    document.getElementById('totalIncome').textContent = formatMoney(totalIncome);
    
    const finalBalanceElement = document.getElementById('finalBalance');
    finalBalanceElement.textContent = formatMoney(finalBalance);
    
    if (finalBalance >= 0) {
        finalBalanceElement.className = 'positive';
    } else {
        finalBalanceElement.className = 'negative';
    }
    
    saveData();
}

// Função para salvar dados no localStorage
function saveData() {
    const data = {
        accounts: accounts,
        extraIncome: extraIncome,
        salary: document.getElementById('salary').value
    };
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadSavedData() {
    const savedData = localStorage.getItem(getStorageKey());

    if (savedData) {
        const data = JSON.parse(savedData);
        accounts = data.accounts || [];
        extraIncome = data.extraIncome || [];
        document.getElementById('salary').value = data.salary || '';
    } else {
        accounts = [];
        extraIncome = [];
        document.getElementById('salary').value = '';
    }

    updateAccountsTable();
    updateIncomeTable();
    updateSummary();
}

document.getElementById('month').addEventListener('change', loadSavedData);
document.getElementById('year').addEventListener('change', loadSavedData);

const API_URL = "https://script.google.com/macros/s/AKfycbxRW9icwOkeg5oTzy1MZWOha3QqfnAY9iQGUPNEulJ3naOJDqf13SZ9HNnORziLNJBN/exec"; // coloque a URL do Apps Script

async function saveData() {
    const data = {
        accounts,
        extraIncome,
        salary: document.getElementById('salary').value
    };

    const payload = {
        action: "salvar",
        ano: document.getElementById('year').value,
        mes: document.getElementById('month').value,
        dados: data
    };

    await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

async function loadSavedData() {
    const payload = {
        action: "buscar",
        ano: document.getElementById('year').value,
        mes: document.getElementById('month').value
    };

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    accounts = data.accounts || [];
    extraIncome = data.extraIncome || [];
    document.getElementById('salary').value = data.salary || '';

    updateAccountsTable();
    updateIncomeTable();
    updateSummary();
}
