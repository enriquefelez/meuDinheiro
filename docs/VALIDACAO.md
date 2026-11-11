# Validação com seu Supabase

## Resultado local da implementação — 11/11/2026

- `npm run build`: aprovado, incluindo `vue-tsc --noEmit` e geração de `dist`.
- `npm test`: 5 testes aprovados, nenhuma falha.
- O Vite avisou sobre tamanho dos arquivos JavaScript, principalmente bibliotecas de gráficos/Ionic; isso não impediu o build.
- Não foi realizada verificação visual automatizada no navegador nem teste contra Supabase real, pois não há ambiente Supabase configurado.

## Validação de integração a realizar

Pendente até configurar `.env` e executar o SQL. Use duas contas próprias e dados de teste identificáveis; remova-os depois.

1. Sem login, abra `/#/receitas`: deve ir para login. Teste senha errada e campos obrigatórios.
2. Cadastre A com senhas diferentes, depois iguais. Se confirmação estiver ativa, confirme pelo e-mail antes de entrar. Recarregue a página e confira a sessão.
3. Em A, crie receita 1.234,56 e despesa 234,56 no mesmo período. Confira saldo R$ 1.000,00, dois lançamentos e percentual aproximadamente 19%. Tente zero, valor negativo e casas decimais excessivas.
4. Edite valor/categoria/data; verifique lista e dashboard. Salve com cliques repetidos: apenas uma gravação deve ocorrer. Cancele uma exclusão; depois confirme e confira atualização.
5. Crie registros em dezembro de um ano e janeiro do seguinte. Confira a ordem e os anos no gráfico de barras. Confira somas por categoria no gráfico de pizza.
6. Filtre um único dia com registros, um intervalo vazio, este mês e todo o período. Inverta datas: deve aparecer erro. Sem receitas, deve mostrar a mensagem correspondente, sem percentual inválido.
7. Ative tema escuro, visite todas as telas e recarregue. Teste no celular e computador.
8. Saia de A e entre com B: não deve ver registros de A. Crie um registro B e confirme que A não o vê.
9. Para validar RLS independentemente da interface, no console de desenvolvimento do navegador autenticado como B, importe `createClient` de `@supabase/supabase-js` por um script temporário local usando as mesmas variáveis públicas. Use a sessão de B e tente SELECT/UPDATE/DELETE do UUID de um registro de A: nenhum registro deve ser retornado ou alterado. Tente INSERT com `user_id` de A: deve falhar. Tente UPDATE de um registro B mudando `user_id` para A: deve falhar. Não use service_role ou SQL Editor como administrador para provar isolamento, pois eles podem ignorar RLS.
10. Desconecte a rede e teste consulta/salvamento: deve haver erro sem mensagem falsa de sucesso. Saia e verifique o redirecionamento para login.

Anote resultados reais, data e eventuais ajustes antes de entregar a atividade. Não publique tokens de sessão ou senhas nas capturas.
