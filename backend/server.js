import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import ws from "ws"; // IMPORTANTE: Importa o pacote ws para dar suporte ao Node v20

const app = express();

// Configurações para ler caminhos no formato ES Modules (type: "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem ser definidas no ambiente.",
  );
  process.exit(1);
}

// Inicialização corrigida passando o 'ws' no campo realtime.transport
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false // Boa prática para ambientes server-side (Node)
  },
  realtime: {
    transport: ws,
  },
});

// 1. SERVIR ARQUIVOS ESTÁTICOS DO VUE FIRST (Evita o 401 no Favicon/Assets)
app.use(express.static(path.join(__dirname, "../dist")));

// 2. ROTA PÚBLICA DE HEALTH (Usada pelo Railway para checar se o container está vivo)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 3. MIDDLEWARE DE ASSINATURA DA API KEY
function requireApiKey(req, res, next) {
  if (!BACKEND_API_KEY) return next();
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== BACKEND_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Protege todas as rotas abaixo com a API Key
app.use(requireApiKey);

// ==================== ROTAS PROTEGIDAS DA API ====================

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
    return res
      .status(400)
      .json({ error: "Nome, tipo e mensagem são obrigatórios." });
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

// =================================================================

// 4. FALLBACK PARA VUE ROUTER (Sempre por último)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
