<template>
    <div class="login-container">
        <div class="login-box">
            <h2>020 Sistema - Login</h2>
            <p class="subtitle">Insira suas credenciais para acessar o painel administrativo.</p>

            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label>E-mail Corporativo</label>
                    <input v-model="email" type="email" placeholder="seu@email.com" required />
                </div>

                <div class="input-group">
                    <label>Senha</label>
                    <input v-model="password" type="password" placeholder="••••••••" required />
                </div>

                <button type="submit" :disabled="carregando">
                    {{ carregando ? 'Autenticando...' : 'Entrar no Sistema' }}
                </button>
            </form>

            <div v-if="mensagemErro" class="erro-box">
                {{ mensagemErro }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const carregando = ref(false)
const mensagemErro = ref('')

const handleLogin = async () => {
    carregando.value = true
    mensagemErro.value = ''

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (error) throw error

        // Se o login for bem-sucedido, o próprio router.beforeEach vai validar
        // Redireciona o usuário para o Dashboard
        router.push({ name: 'dashboard' })

    } catch (error) {
        mensagemErro.value = `Falha na autenticação: ${error.message || 'Erro inesperado'}`
    } finally {
        carregando.value = false
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #121214;
    font-family: sans-serif;
}

.login-box {
    background: #1c1c1e;
    padding: 40px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    color: #ffffff;
}

h2 {
    margin-bottom: 8px;
    color: #3ecf8e;
    text-align: center;
}

.subtitle {
    color: #8e8e93;
    font-size: 14px;
    text-align: center;
    margin-bottom: 24px;
}

.input-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 6px;
    color: #eaeaea;
    font-size: 14px;
}

input {
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #2e2e32;
    background: #2a2a2e;
    color: white;
    box-sizing: border-box;
}

input:focus {
    border-color: #3ecf8e;
    outline: none;
}

button {
    width: 100%;
    padding: 12px;
    background: #3ecf8e;
    color: #121214;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
}

button:hover {
    background: #32b37a;
}

button:disabled {
    background: #2a634a;
    cursor: not-allowed;
    color: #888;
}

.erro-box {
    margin-top: 20px;
    padding: 12px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
}
</style>