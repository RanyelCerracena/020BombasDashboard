<template>
    <div class="dashboard-layout">
        <header>
            <h2>Painel Interno 020</h2>
            <button @click="handleLogout" class="btn-logout">Sair do Sistema</button>
        </header>

        <main>
            <div class="card-cadastro">
                <h3>Cadastrar Novo Cliente</h3>
                <p>Este formulário só envia dados porque você está autenticado.</p>

                <form @submit.prevent="cadastrarCliente">
                    <div class="form-group">
                        <label>Nome do Cliente:</label>
                        <input v-model="cliente.nome" type="text" placeholder="Ex: João Silva" required />
                    </div>

                    <div class="form-group">
                        <label>WhatsApp:</label>
                        <input v-model="cliente.telefone" type="text" placeholder="Ex: 5561999999999" required />
                    </div>

                    <div class="form-group">
                        <label>Data de Nascimento:</label>
                        <input v-model="cliente.data_nascimento" type="date" required />
                    </div>

                    <button type="submit" :disabled="carregando">
                        {{ carregando ? 'Salvando...' : 'Cadastrar no Banco' }}
                    </button>
                </form>

                <p v-if="notificacao" :class="['notificacao', { erro: statusErro }]">{{ notificacao }}</p>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'

const router = useRouter()
const cliente = ref({ nome: '', telefone: '', data_nascimento: '' })
const carregando = ref(false)
const notificacao = ref('')
const statusErro = ref(false)

const cadastrarCliente = async () => {
    carregando.value = true
    notificacao.value = ''
    statusErro.value = false

    try {
        const { error } = await supabase
            .from('clientes')
            .insert([cliente.value])

        if (error) throw error

        notificacao.value = "Cliente cadastrado com sucesso e protegido por RLS!"
        cliente.value = { nome: '', telefone: '', data_nascimento: '' }
    } catch (error) {
        statusErro.value = true
        notificacao.value = `Erro ao salvar: ${error.message}`
    } finally {
        carregando.value = false
    }
}

const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push({ name: 'login' })
}
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