-- Execute este arquivo completo no SQL Editor do seu projeto Supabase.
begin;
create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null check (length(trim(descricao)) between 1 and 200),
  valor numeric(12,2) not null check (valor > 0 and valor < 10000000000),
  categoria text not null check (categoria in ('Salário','Freelance','Investimentos','Outros')),
  data date not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade
);
create table if not exists public.despesas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null check (length(trim(descricao)) between 1 and 200),
  valor numeric(12,2) not null check (valor > 0 and valor < 10000000000),
  categoria text not null check (categoria in ('Alimentação','Transporte','Moradia','Educação','Lazer','Saúde','Outros')),
  data date not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade
);
create index if not exists receitas_usuario_data_idx on public.receitas(user_id, data desc, id);
create index if not exists despesas_usuario_data_idx on public.despesas(user_id, data desc, id);
alter table public.receitas enable row level security;
alter table public.despesas enable row level security;
-- Reexecutável: substitui somente as políticas criadas por este projeto.
do $$
declare tabela text;
begin
  foreach tabela in array array['receitas','despesas'] loop
    execute format('drop policy if exists usuario_select on public.%I', tabela);
    execute format('drop policy if exists usuario_insert on public.%I', tabela);
    execute format('drop policy if exists usuario_update on public.%I', tabela);
    execute format('drop policy if exists usuario_delete on public.%I', tabela);
    execute format('create policy usuario_select on public.%I for select to authenticated using ((select auth.uid()) = user_id)', tabela);
    execute format('create policy usuario_insert on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', tabela);
    execute format('create policy usuario_update on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', tabela);
    execute format('create policy usuario_delete on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', tabela);
    execute format('revoke all on public.%I from anon', tabela);
    execute format('grant select, insert, update, delete on public.%I to authenticated', tabela);
  end loop;
end $$;
commit;
