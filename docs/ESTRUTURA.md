# Onde fica cada página

Cada rota tem seu próprio arquivo em `src/views`:

| Página | Arquivo | Rota |
| --- | --- | --- |
| Login | `LoginPage.vue` | `/login` |
| Cadastro | `CadastroPage.vue` | `/cadastro` |
| Dashboard e gráficos | `DashboardPage.vue` | `/dashboard` |
| Receitas | `ReceitasPage.vue` | `/receitas` |
| Despesas | `DespesasPage.vue` | `/despesas` |
| Configurações, tema e logout | `ConfiguracoesPage.vue` | `/configuracoes` |

As rotas e a proteção de acesso estão em `src/main.ts`. O antigo `Workspace.vue`, que reunia as páginas internas, foi removido.

Cada página contém sua própria interface e as funções específicas da tela. `LoginPage.vue` faz login; `CadastroPage.vue` valida senhas, cadastra e orienta a confirmação de e-mail. `ReceitasPage.vue` e `DespesasPage.vue` contêm seus campos, lista, carregamento, salvamento, edição e exclusão. `DashboardPage.vue` contém cards, gráficos e carregamento. `ConfiguracoesPage.vue` contém tema e logout.

Somente o menu, cabeçalho e rodapé (`src/components/AppLayout.vue`) e o filtro (`PeriodFilter.vue`) são componentes visuais compartilhados. `src/lib/finance.ts` contém os cálculos; `src/store.ts` mantém sessão, tema, filtro e lançamentos em memória. A conexão e as mensagens de erro do Supabase ficam em `src/lib/supabase.ts`.

Após a separação: checagem TypeScript, build web, sincronização do Capacitor Android e cinco testes financeiros passaram. A navegação e as operações com Supabase devem ser conferidas no navegador/dispositivo; não foram automatizadas nesta alteração.
