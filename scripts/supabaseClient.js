import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const isValidSupabaseUrl = /^https?:\/\//.test(supabaseUrl);

if (!isValidSupabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: Variáveis de ambiente do Supabase inválidas no ambiente Node. Use VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co e VITE_SUPABASE_ANON_KEY=<sua-chave-anon>",
  );
}

export const supabase =
  isValidSupabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
