<template>
    <div class="templates-layout">
        <header>
            <h2>Templates de Mensagem</h2>
            <router-link to="/" class="back">Voltar</router-link>
        </header>

        <main>
            <div class="card">
                <h3>Cadastrar / Editar Template</h3>

                <form @submit.prevent="salvarTemplate">
                    <div class="form-group">
                        <label>Nome do Template</label>
                        <input v-model="form.nome" required />
                    </div>

                    <div class="form-group">
                        <label>Tipo</label>
                        <select v-model="form.tipo">
                            <option value="aniversario">Aniversário</option>
                            <option value="ultimo_servico">Último Serviço</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Mensagem (use {nome} ou { nome })</label>
                        <textarea v-model="form.mensagem" rows="5" required></textarea>
                    </div>

                    <button type="submit">{{ editando ? 'Atualizar' : 'Cadastrar' }}</button>
                    <button type="button" @click="resetForm" class="btn-cancel">Cancelar</button>
                </form>
            </div>

            <div class="card">
                <h3>Lista de Templates</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Mensagem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in templates" :key="t.id">
                            <td>{{ t.nome }}</td>
                            <td>{{ t.tipo }}</td>
                            <td>{{ t.mensagem }}</td>
                            <td>
                                <button @click="editar(t)">Editar</button>
                                <button @click="remover(t.id)" class="danger">Remover</button>
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
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from '../api'

const templates = ref([])
const form = ref({ id: null, nome: '', tipo: 'aniversario', mensagem: '' })
const editando = ref(false)

const load = async () => {
    try {
        templates.value = await getTemplates()
    } catch (error) {
        console.error('Erro ao buscar templates', error)
        alert('Erro ao buscar templates: ' + (error.message || error))
    }
}

const salvarTemplate = async () => {
    try {
        if (editando.value) {
            await updateTemplate(form.value.id, {
                nome: form.value.nome,
                tipo: form.value.tipo,
                mensagem: form.value.mensagem,
            })
        } else {
            await createTemplate({
                nome: form.value.nome,
                tipo: form.value.tipo,
                mensagem: form.value.mensagem,
            })
        }
        await load()
        resetForm()
    } catch (err) {
        console.error('Erro salvar template', err)
        alert('Erro ao salvar template: ' + (err.message || err))
    }
}

const editar = (t) => {
    form.value = { ...t }
    editando.value = true
}

const remover = async (id) => {
    if (!confirm('Remover template?')) return
    try {
        await deleteTemplate(id)
        await load()
    } catch (error) {
        console.error('Erro ao remover template', error)
        alert('Erro ao remover template: ' + (error.message || error))
    }
}

const resetForm = () => {
    form.value = { id: null, nome: '', tipo: 'aniversario', mensagem: '' }
    editando.value = false
}

onMounted(load)
</script>

<style scoped>
.templates-layout {
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
