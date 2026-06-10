<template>
    <div class="clients-layout">
        <header>
            <h2>Clientes</h2>
            <router-link to="/" class="back">Voltar</router-link>
        </header>

        <main>
            <div class="card">
                <h3>Cadastrar / Editar Cliente</h3>

                <form @submit.prevent="salvarCliente">
                    <div class="form-group">
                        <label>Nome</label>
                        <input v-model="form.nome" required />
                    </div>

                    <div class="form-group">
                        <label>WhatsApp</label>
                        <input v-model="form.telefone" placeholder="5561..." required />
                    </div>

                    <div class="form-group">
                        <label>Data de Nascimento</label>
                        <input v-model="form.data_nascimento" type="date" />
                    </div>

                    <button type="submit">{{ editando ? 'Atualizar' : 'Cadastrar' }}</button>
                    <button type="button" @click="resetForm" class="btn-cancel">Cancelar</button>
                </form>
            </div>

            <div class="card">
                <h3>Lista de Clientes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>WhatsApp</th>
                            <th>Data Nasc.</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in clientes" :key="c.id">
                            <td>{{ c.nome }}</td>
                            <td>{{ c.telefone }}</td>
                            <td>{{ c.data_nascimento }}</td>
                            <td>
                                <button @click="editar(c)">Editar</button>
                                <button @click="remover(c.id)" class="danger">Remover</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
    getClients,
    createClient,
    updateClient,
    deleteClient,
} from '../api'

const clientes = ref([])
const form = ref({ id: null, nome: '', telefone: '', data_nascimento: '' })
const editando = ref(false)

const load = async () => {
    try {
        clientes.value = await getClients()
    } catch (error) {
        console.error('Erro ao buscar clientes', error)
        alert('Erro ao buscar clientes: ' + (error.message || error))
    }
}

const salvarCliente = async () => {
    try {
        if (editando.value) {
            await updateClient(form.value.id, {
                nome: form.value.nome,
                telefone: form.value.telefone,
                data_nascimento: form.value.data_nascimento,
            })
        } else {
            await createClient({
                nome: form.value.nome,
                telefone: form.value.telefone,
                data_nascimento: form.value.data_nascimento,
            })
        }

        await load()
        resetForm()
    } catch (err) {
        console.error('Erro salvar cliente', err)
        alert('Erro ao salvar cliente: ' + (err.message || err))
    }
}

const editar = (c) => {
    form.value = { ...c }
    editando.value = true
}

const remover = async (id) => {
    if (!confirm('Remover cliente?')) return
    try {
        await deleteClient(id)
        await load()
    } catch (error) {
        console.error('Erro ao remover cliente', error)
        alert('Erro ao remover cliente: ' + (error.message || error))
    }
}

const resetForm = () => {
    form.value = { id: null, nome: '', telefone: '', data_nascimento: '' }
    editando.value = false
}

onMounted(load)
</script>

<style scoped>
.clients-layout {
    font-family: sans-serif;
    color: white;
    background: #121214;
    min-height: 100vh
}

header {
    display: flex;
    justify-content: space-between;
    padding: 20px
}

.back {
    color: #3ecf8e
}

main {
    padding: 20px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap
}

.card {
    background: #1c1c1e;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 800px
}

table {
    width: 100%;
    border-collapse: collapse
}

th,
td {
    padding: 8px;
    border-bottom: 1px solid #2e2e32
}

button {
    padding: 6px 10px;
    margin-right: 6px
}

.danger {
    background: #ed4245;
    color: white
}

.btn-cancel {
    margin-left: 10px
}
</style>
