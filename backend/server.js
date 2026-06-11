import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permite que o seu front-end hospedado em outro domínio acesse a API sem problemas de CORS
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Erro fatal: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas.");
  process.exit(1);
}

// Inicialização segura do Supabase isolando o transporte de realtime com o pacote WS
let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    },
    realtime: {
      transport: ws,
    },
  });
} catch (err) {
  console.error("Erro ao inicializar o cliente do Supabase:", err);
  process.exit(1);
}

// ==================== CAMADA 1: ROTAS PÚBLICAS DE INFRAESTRUTURA ====================

// Rota de Health pública para o Railway monitorar o container (Evita 401 e mantém o serviço UP)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Bloqueia respostas desnecessárias para o Favicon sem passar pelos middlewares
app.get("/favicon.ico", (req, res) => res.status(204).end());


// ==================== CAMADA 2: MIDDLEWARE DE SEGURANÇA (API KEY) ====================

function requireApiKey(req, res, next) {
  // Se a rota for o health check, ignora a API key
  if (req.path === "/api/health") {
    return next();
  }

  // Validação da chave para as rotas legítimas de dados (/api/clients, etc)
  if (!BACKEND_API_KEY) return next();
  
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== BACKEND_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Aplica a validação de segurança em todas as rotas abaixo
app.use(requireApiKey);


// ==================== CAMADA 3: ROTAS PROTEGIDAS DA API ====================

// --- CLIENTES ---
app.get("/api/clients", async (req, res) => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nome");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.post("/api/clients", async (req, res) => {
  const { nome, telefone, data_nascimento } = req.body;
  if (!nome || !telefone) {
    return res.status(400).json({ error: "Nome e telefone são obrigatórios." });
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert([{ nome, telefone, data_nascimento }])
    .select();
  if (error) return res.status(500).json({ error });
  res.status(201).json(data[0]);
});

app.put("/api/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, data_nascimento } = req.body;
  const { data, error } = await supabase
    .from("clientes")
    .update({ nome, telefone, data_nascimento })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

app.delete("/api/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

// --- TEMPLATES ---
app.get("/api/templates", async (req, res) => {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("nome");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.post("/api/templates", async (req, res) => {
  const { nome, tipo, mensagem } = req.body;
  if (!nome || !tipo || !mensagem) {
    return res.status(400).json({ error: "Nome, tipo e mensagem são obrigatórios." });
  }

  const { data, error } = await supabase
    .from("templates")
    .insert([{ nome, tipo, mensagem }])
    .select();
  if (error) return res.status(500).json({ error });
  res.status(201).json(data[0]);
});

app.put("/api/templates/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, mensagem } = req.body;
  const { data, error } = await supabase
    .from("templates")
    .update({ nome, tipo, mensagem })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

app.delete("/api/templates/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});


// ==================== CAMADA 4: FALLBACK DE SEGURANÇA ====================

// Qualquer rota que não corresponda aos endpoints acima recebe 404 em JSON limpo (Sem crashar!)
app.use((req, res) => {
  res.status(404).json({ error: `Rota '${req.originalUrl}' não encontrada neste servidor de API.` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor de API ativo com sucesso na porta ${port}`);
});
