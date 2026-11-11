# Meu Dinheiro

Aplicativo de controle financeiro pessoal para o curso Técnico em Informática para Internet. Interface responsiva em português, verde, com Ionic Framework, Vue 3, Composition API, TypeScript, Vue Router, Supabase Auth/Postgres e Vue ApexCharts. Não usa registros fictícios nem armazenamento local para os lançamentos.

## Iniciar

Instale Node.js 22 LTS ou superior e Git. Na pasta do projeto:

```powershell
npm install
Copy-Item .env.example .env
```

Configure o Supabase conforme abaixo e execute:

```powershell
npm run dev
```

Abra o endereço local exibido pelo Vite (normalmente http://localhost:5173). Sem configuração, a tela informa a pendência e não simula login ou dados.

## Banco: passo a passo

1. Crie ou abra seu projeto no Supabase. Aguarde o banco estar disponível.
2. Abra **SQL Editor**, crie uma consulta e cole o conteúdo completo de [database/001_schema.sql](database/001_schema.sql). Clique em **Run**. O banco continua hospedado no Supabase; `database` guarda seu script de criação.
3. Confira no Table Editor as tabelas `public.receitas` e `public.despesas`. O script cria UUID automático, campos obrigatórios, valor positivo, categorias, vínculo com `auth.users`, índices por usuário/data e RLS.
4. Em configurações do projeto, copie a URL do projeto e a chave pública **publishable** (ou a chave legada **anon**). Preencha seu `.env`:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

5. Nunca utilize `service_role`, secret key, senha do banco ou credenciais administrativas no frontend. As variáveis `VITE_` são públicas no build; a proteção dos registros é feita pelo RLS.
6. Na configuração de URLs de Authentication, defina **Site URL** como `http://localhost:5173` e inclua `http://localhost:5173` e `http://localhost:5173/` nas URLs de redirecionamento permitidas. Se usar outra porta ou publicar, cadastre também o endereço correspondente.
7. Na configuração do provedor de e-mail de Authentication, mantenha a confirmação de e-mail conforme sua necessidade. Com confirmação ativa, o cadastro orienta abrir o link recebido; sem confirmação, a sessão pode ser iniciada diretamente. Para entrega de e-mail fora dos limites do serviço padrão, configure seu SMTP no Supabase.
8. Reinicie `npm run dev` após editar `.env`. Cadastre uma conta, confirme o e-mail se necessário e entre.

O SQL pode ser reexecutado em um banco criado por este projeto. `create table if not exists` não migra tabelas preexistentes com estrutura diferente. Não há seed nem necessidade de inserir usuários manualmente: o cadastro usa Supabase Auth. Políticas SELECT/INSERT/UPDATE/DELETE verificam `auth.uid()`. UPDATE verifica proprietário atual e futuro, impedindo transferência a outra conta.

## Funcionalidades e organização

- Login, cadastro, confirmação de senha, confirmação de e-mail, sessão persistente, proteção das rotas e logout.
- CRUD de receitas e despesas com categorias, confirmação de exclusão, bloqueio de cliques repetidos, validações e estados de sucesso/erro/carregamento/lista vazia.
- Valores brasileiros com vírgula e cálculos em centavos; datas sem conversão de fuso.
- Dashboard com saldo, totais, maior categoria de gasto, número de lançamentos, percentual e gráficos reais. Sem receita, o percentual informa “Sem receitas no período”.
- Extra 1: filtro global inclusivo por período, intervalo validado, atalhos para este mês e todo o período.
- Extra 2: tema escuro persistido no dispositivo, incluindo gráficos.
- Consultas paginadas para não limitar os totais aos primeiros 1.000 registros.

`src/views`: autenticação e área interna. `src/components`: filtro e formulário reutilizáveis. `src/lib`: conexão, formatação e cálculos. `src/store.ts`: sessão, tema e dados compartilhados. `database`: SQL. `tests`: testes dos cálculos. `docs`: materiais para apresentação. `src/style.css`: layout responsivo.

## Verificação e build

```powershell
npm test
npm run typecheck
npm run build
npm run preview
```

O build estático fica em `dist`. Usa navegação por hash, dispensando regras especiais de fallback nas hospedagens estáticas. Não há APK ou integração nativa Capacitor nesta entrega.

Os testes automatizados cobrem valores com vírgula, centavos, entradas inválidas, totais, saldo, ausência de receita, agrupamento mensal entre anos, categorias, filtros inclusivos e datas. TypeScript e build verificam a compilação. Autenticação, CRUD, confirmação por e-mail e RLS precisam de um Supabase configurado; não foram testados contra um banco real nesta entrega. Veja [docs/VALIDACAO.md](docs/VALIDACAO.md) para executar essa validação.

## Git e GitHub

O projeto inclui `.gitignore` para dependências, build e segredos. Revise os arquivos antes de publicar:

```powershell
git init
git status
git add .
git diff --cached
git commit -m "Implementa aplicativo Meu Dinheiro"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Crie antes um repositório vazio no GitHub e substitua a URL. Se já houver Git ou remote, preserve-os e pule os comandos correspondentes. Nunca adicione `.env`. Registre commits reais conforme desenvolver. Nenhum commit ou publicação remota foi inventado ou realizado automaticamente.
