import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key && !url.includes('SEU-PROJETO'));
export const supabase = configured ? createClient(url, key, {auth: {persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}}) : null;
export function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String((error as {message?:string})?.message || error);
  if (/Invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(message)) return 'Confirme seu e-mail antes de entrar.';
  if (/already registered/i.test(message)) return 'Este e-mail já está cadastrado.';
  if (/rate limit/i.test(message)) return 'Muitas tentativas. Aguarde alguns minutos.';
  if (/fetch|network/i.test(message)) return 'Não foi possível conectar. Verifique sua internet e a configuração do Supabase.';
  if (/row-level security/i.test(message)) return 'Acesso negado. Entre novamente e verifique as políticas do banco.';
  if (/relation|schema cache/i.test(message)) return 'Tabelas indisponíveis. Execute database/001_schema.sql no Supabase.';
  return 'Não foi possível concluir a operação. Verifique a conexão e a configuração do banco.';
}
