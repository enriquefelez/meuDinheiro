# Texto-base para PDF

## Capa
**Meu Dinheiro — Controle financeiro pessoal**
Curso: Técnico em Informática para Internet
Integrantes: [preencher nomes reais]
Turma: [preencher] • Professor(a): [preencher] • Data: [preencher]

## Objetivo
O Meu Dinheiro permite registrar receitas e despesas pessoais, acompanhar saldo e visualizar hábitos financeiros por categoria e mês. Cada conta acessa somente seus próprios registros.

## Tecnologias
Ionic Framework e Vue 3 para interface e navegação; TypeScript e Composition API para organização; Supabase Auth e PostgreSQL para autenticação e persistência; Vue ApexCharts para gráficos; Git e GitHub para versionamento.

## Funcionalidades
Cadastro e login, sessão persistente, receitas e despesas com inclusão, edição e exclusão, dashboard com totais e indicadores. Extras: filtro por período e modo escuro salvo no dispositivo.

## Capturas a inserir
1. Login e cadastro (sem senha visível).
2. Lista e formulário de receitas.
3. Lista e formulário de despesas.
4. Dashboard com cards, pizza e barras usando dados de demonstração reais cadastrados.
5. Filtro aplicado e estado sem dados.
6. Configurações e tema escuro, incluindo versão em largura de celular.
7. Estrutura das tabelas e políticas RLS, sem chaves ou informações de conta.

## Segurança e cálculos
As tabelas vinculam registros ao usuário autenticado. O RLS verifica o proprietário em consultas e alterações, inclusive impedindo transferência a outro usuário. Totais são calculados em centavos e datas são exibidas sem conversão de fuso horário.

## Testes e desafios
Testes realmente executados pela equipe: [preencher resultados e data].
Dificuldades realmente encontradas: [preencher somente fatos ocorridos].
Como foram resolvidas: [preencher com evidências].
Pendências encontradas durante a apresentação: [preencher ou informar nenhuma após verificar].

## Conclusão
[Descrever o aprendizado real da equipe e possíveis melhorias futuras.]
Repositório GitHub: [inserir link real após publicar].
