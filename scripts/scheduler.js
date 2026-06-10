import cron from "node-cron";
import { supabase } from "./supabaseClient.js";

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
  console.warn(
    "Aviso: EVOLUTION_API_URL ou EVOLUTION_API_KEY não definidos. O envio não funcionará até configurados.",
  );
}

function renderMessage(template, cliente) {
  return template.replace(/\{\s*nome\s*\}|\{nome\}/gi, cliente.nome || "");
}

async function sendMessage(to, message) {
  try {
    const res = await fetch(EVOLUTION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EVOLUTION_API_KEY}`,
      },
      body: JSON.stringify({ to, message }),
    });

    const data = await res.json().catch(() => null);
    console.log("Enviado para", to, "->", res.status, data);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error("Erro ao enviar mensagem para", to, err);
    return { ok: false, error: err };
  }
}

async function job() {
  console.log(new Date().toISOString(), "Iniciando job de envio");

  // buscar templates
  const { data: templates, error: tErr } = await supabase
    .from("templates")
    .select("*");
  if (tErr) return console.error("Erro ao buscar templates", tErr);

  // buscar clientes
  const { data: clientes, error: cErr } = await supabase
    .from("clientes")
    .select("*");
  if (cErr) return console.error("Erro ao buscar clientes", cErr);

  for (const tpl of templates || []) {
    const targets = (clientes || []).filter((cli) => {
      if (tpl.tipo === "aniversario") {
        if (!cli.data_nascimento) return false;
        const d = new Date(cli.data_nascimento);
        const hoje = new Date();
        return (
          d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth()
        );
      }
      // para ultimo_servico você pode adaptar com campo específico; aqui envia para todos
      if (tpl.tipo === "ultimo_servico") return true;
      return false;
    });

    for (const cliente of targets) {
      const mensagem = renderMessage(tpl.mensagem, cliente);
      await sendMessage(cliente.telefone, mensagem);
    }
  }

  console.log(new Date().toISOString(), "Job finalizado");
}

// Agendar para 08:00 todos os dias
cron.schedule(
  "0 8 * * *",
  () => {
    job();
  },
  { timezone: "America/Sao_Paulo" },
);

// Executar imediatamente na inicialização (útil para testes locais)
job();
