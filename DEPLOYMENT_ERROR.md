# Erro de Deployment - 020 Bombas Dashboard

## 🔴 Erro Atual

**Mensagem no Console do Navegador:**

```
Failed to load resource: net::ERR_CONNECTION_REFUSED (13900/api/clientes)
TypeError: Failed to fetch at request (index.js:16:23)
```

**Componente Afetado:** ClientsView.vue (linha 78)

**Causa Raiz:**
O frontend está tentando conectar ao backend em `http://localhost:3000/api` (URL padrão local), mas:

- ✅ Backend foi deployado com sucesso no Railway
- ❌ Frontend não sabe qual é a URL do backend no Railway
- ❌ Requisição vai para localhost, que não existe no Railway

---

## 🔍 Detalhes Técnicos

### Configuração Atual do Frontend

**Arquivo:** `src/api/index.js` (linhas 1-3)

```javascript
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000/api";
```

**Problema:**

- `VITE_BACKEND_URL` não está definida
- Cai para o padrão local `http://localhost:3000/api`
- No Railway, isso tenta conectar a si mesmo (frontend rodando na porta padrão do Railway)

---

## 📋 Solução Requerida

### Para Outra IA Continuar:

1. **Obter a URL do Backend no Railway**
   - Acesso: Dashboard Railway → Seu app → Settings → Domains
   - Formato esperado: `https://seu-app-nome.railway.app`

2. **Configurar Variáveis de Ambiente no Railway (Frontend)**
   - Se o frontend também está no Railway:
     - Adicionar variável: `VITE_BACKEND_URL=https://seu-app-backend.railway.app`
   - Se o frontend é local:
     - Criar `.env.local` com: `VITE_BACKEND_URL=https://seu-app-backend.railway.app`

3. **Revalidar Estrutura de Deploy**
   - Frontend está rodando onde? (local, Railway, Vercel, etc)
   - Backend está rodando onde? (Railway, confirmado)
   - Ambos precisam estar acessíveis um do outro

4. **Passos de Correção**

   ```bash
   # Se frontend é local:
   echo "VITE_BACKEND_URL=https://seu-backend-railway.railway.app" >> .env.local
   npm run dev

   # Se frontend está no Railway:
   # Adicionar variável de ambiente via dashboard Railway
   # Redeployer o projeto
   ```

---

## 🛠️ Estado Atual do Projeto

### Backend

- **Status:** ✅ Deployado no Railway
- **Tecnologia:** Node.js 20 + Express
- **Última Fix:** Desabilitou realtime do Supabase (WebSocket)
- **Packages Instalados:** ws (para WebSocket support)
- **Commit:** `4231682` - "fix: disable realtime and add ws package for Node 20 WebSocket support"

### Frontend

- **Status:** ❌ Não consegue conectar ao backend
- **Tecnologia:** Vue 3.5.32 + Vite
- **Problema:** BASE_URL não configurada
- **Última Alteração:** Usando padrão local

### Scheduler

- **Status:** ⏳ Não testado após deploy
- **Tecnologia:** node-cron com Supabase
- **Execução:** Daily 08:00 (America/Sao_Paulo)

---

## 📝 Checklist para Próxima IA

- [ ] Obter URL exata do backend Railway
- [ ] Verificar se frontend está no Railway ou local
- [ ] Configurar VITE_BACKEND_URL apropriadamente
- [ ] Fazer rebuild/redeploy se necessário
- [ ] Testar GET /api/health (deve retornar `{"status":"ok"}`)
- [ ] Testar GET /api/clients (deve retornar lista de clientes)
- [ ] Testar CRUD completo (create, read, update, delete)
- [ ] Validar scheduler (executar `npm run scheduler` ou testar no Railway)

---

## 🔗 Links Úteis

- **GitHub:** https://github.com/RanyelCerracena/020BombasDashboard
- **Railway:** [Seu dashboard Railway]
- **Supabase:** https://app.supabase.com

---

## 📌 Notas Importantes

1. **Nunca** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
2. `VITE_BACKEND_URL` deve ser a URL pública do backend Express (Railway)
3. CORS está habilitada no backend, então qualquer origem pode chamar
4. Se adicionar autenticação, usar header `x-api-key` (já implementado)
