<template>
    <div class="dashboard-layout">
        <header>
            <h2>Painel Interno 020</h2>
        </header>

        <main>
            <div class="card-cadastro">
                <h3>Bem-vindo</h3>
                <p>Use as opções abaixo para gerenciar clientes e templates de mensagem.</p>

                <div class="nav-links">
                    <router-link to="/clientes" class="nav-btn">Gerenciar Clientes</router-link>
                    <router-link to="/templates" class="nav-btn">Gerenciar Templates</router-link>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
// Dashboard simples com links para os módulos
</script>

<style scoped>
.dashboard-layout {
    font-family: sans-serif;
    background: #121214;
    min-height: 100vh;
    color: white;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: #1c1c1e;
    border-bottom: 1px solid #2e2e32;
}

.btn-logout {
    background: #ed4245;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

main {
    padding: 40px;
    display: flex;
    justify-content: center;
}

.card-cadastro {
    background: #1c1c1e;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    border: 1px solid #2e2e32;
}

.nav-links {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

.nav-btn {
    display: inline-block;
    padding: 10px 14px;
    background: #3ecf8e;
    color: #121214;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
}

.nav-btn:hover {
    background: #32b37a
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #a4a4a4;
}

input {
    width: 100%;
    padding: 10px;
    background: #2a2a2e;
    border: 1px solid #2e2e32;
    color: white;
    border-radius: 4px;
    box-sizing: border-box;
}

input:focus {
    border-color: #3ecf8e;
    outline: none;
}

button[type="submit"] {
    width: 100%;
    padding: 12px;
    background: #3ecf8e;
    color: #121214;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
}

.notificacao {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    background: #dcfce7;
    color: #166534;
    font-size: 14px;
    text-align: center;
}

.notificacao.erro {
    background: #fee2e2;
    color: #991b1b;
}
</style>