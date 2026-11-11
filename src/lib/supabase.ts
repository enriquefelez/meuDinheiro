import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key && !url.includes('SEU-PROJETO'));
export const supabase = configured ? createClient(url, key, {auth: {persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}}) : null;
export function errorMessage(error: unknown): string {
  const code = (error as {code?: string} | null)?.code;
  const message = error instanceof Error ? error.message : String((error as {message?:string})?.message || error);
  if (code === 'email_address_not_authorized' || /email.*(not authorized|cannot be used)/i.test(message)) return 'O serviço de e-mail padrão do Supabase não autorizou este destinatário. Configure SMTP próprio no Supabase para enviar confirmações a outras contas.';
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'O limite de envios ou tentativas do Supabase foi atingido. Aguarde antes de tentar novamente.';
  if (code === 'unexpected_failure' && /email/i.test(message) || /error sending confirmation email/i.test(message)) return 'O Supabase não conseguiu enviar a confirmação. Verifique os logs de Authentication e a configuração SMTP do projeto.';
  if (/Invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(message)) return 'Confirme seu e-mail antes de entrar.';
  if (/already registered/i.test(message)) return 'Este e-mail já está cadastrado.';
  if (/rate limit/i.test(message)) return 'Muitas tentativas. Aguarde alguns minutos.';
  if (/fetch|network/i.test(message)) return 'Não foi possível conectar. Verifique sua internet e a configuração do Supabase.';
  if (/row-level security/i.test(message)) return 'Acesso negado. Entre novamente e verifique as políticas do banco.';
  if (/relation|schema cache/i.test(message)) return 'Tabelas indisponíveis. Execute database/001_schema.sql no Supabase.';
  return 'Não foi possível concluir a operação. Verifique a conexão e a configuração do banco.';
}
