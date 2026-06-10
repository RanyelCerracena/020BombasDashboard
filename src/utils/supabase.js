import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const isValidSupabaseUrl = /^https?:\/\//.test(supabaseUrl);

if (!isValidSupabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: Variáveis de ambiente do Supabase inválidas. Use VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co e VITE_SUPABASE_ANON_KEY=<sua-chave-anon> em .env",
  );
}

export const supabase =
  isValidSupabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
