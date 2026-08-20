# Doce Gestão — SaaS de gestão para confeitarias (MVP funcional)

> "O Doce Gestão é a sua plataforma completa para transformar receitas em
> lucro. Controle seu estoque, precifique seus brownies e bolos com precisão
> e acompanhe suas vendas diárias de forma simples e intuitiva."

Protótipo funcional de um SaaS de gestão para confeitarias artesanais,
construído com React + Vite + TypeScript + Tailwind CSS + React Router +
Recharts.

## Como executar o projeto

Pré-requisitos: Node.js 18+.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Na tela de login, use "Acessar com dados de
demonstração" para entrar direto com dados de exemplo já carregados.

## Módulos implementados

### 🔐 Login (`src/pages/Login.tsx`)
Autenticação simplificada (sem backend real — qualquer e-mail/senha "loga").
Inclui atalho de acesso com dados de demonstração.

### 📊 Visão geral / Dashboard (`src/pages/Dashboard.tsx`)
- Faturamento de hoje, dos últimos 7 dias e ticket médio
- Gráfico de barras do faturamento diário (Recharts)
- Ranking dos produtos mais vendidos na semana
- Alerta de ingredientes com estoque abaixo do mínimo
- Produto mais rentável (maior margem real)

### 📦 Estoque (`src/pages/Estoque.tsx`)
- Cadastro de ingredientes (nome, unidade, custo por unidade, estoque atual/mínimo)
- Edição e exclusão
- Registro de **entradas** (compras) e **saídas** (uso em produção) de estoque,
  com histórico de movimentações
- Indicador visual de estoque baixo

### 💰 Precificação (`src/pages/Precificacao.tsx`)
- Criação de receitas combinando ingredientes cadastrados + quantidades
- Cálculo automático do **custo por unidade** (ingredientes + outros custos,
  dividido pelo rendimento da receita)
- Preço sugerido a partir de uma **margem de lucro alvo** (ou preço manual)
- Barra visual mostrando a divisão entre custo da receita e lucro —
  o elemento central do produto: "transformar receita em lucro"

### 🛒 Vendas (`src/pages/Vendas.tsx`)
- Registro de vendas por produto, quantidade, preço, data e canal
  (WhatsApp, Instagram, loja, encomenda...)
- Preço sugerido preenchido automaticamente com base na precificação do produto
- Histórico filtrável por canal e data, com total do período

## Estrutura do projeto

```
src/
  pages/            -> Login, Dashboard, Estoque, Precificacao, Vendas
  components/
    layout/           -> Sidebar, Topbar, AppLayout
    ui/                -> Modal, ConfirmDialog, StatCard, Badge, EmptyState
    PricingBar.tsx     -> elemento visual de custo x lucro
    ProtectedRoute.tsx -> redireciona para /login se não autenticado
  context/
    AuthContext.tsx     -> sessão do usuário (local)
    AppDataContext.tsx  -> ingredientes, receitas, vendas, movimentações + CRUD
  lib/
    calculations.ts   -> motor de cálculo de custo/preço/margem
    seedData.ts        -> dados de demonstração
    id.ts               -> geração de IDs
  hooks/
    useLocalStorageState.ts -> persistência no navegador
  types/               -> tipos TypeScript compartilhados
```

## Limitações deste MVP (importante)

- **Sem backend real**: todos os dados (ingredientes, receitas, vendas,
  usuário) ficam salvos no `localStorage` do navegador. Isso significa que
  os dados não são compartilhados entre dispositivos/usuários e podem ser
  perdidos se o navegador limpar o armazenamento local.
- **Autenticação simplificada**: qualquer e-mail/senha "loga" no app. Não há
  verificação de senha nem múltiplos usuários reais.
- **Sem multiempresa**: o app assume uma única confeitaria usando o navegador.
- **Estoque e receitas não estão automaticamente ligados às vendas**: registrar
  uma venda não desconta o estoque de ingredientes automaticamente (isso exigiria
  "explodir" a receita a cada venda). O controle de estoque é feito via entradas/saídas manuais.

### Próximos passos para virar um SaaS real (produção)

1. **Backend + banco de dados** (ex: Node/PostgreSQL, Supabase, Firebase) para
   persistir dados de forma centralizada e multiusuário.
2. **Autenticação real** (e-mail+senha com hash, ou provedor OAuth) e
   isolamento de dados por conta/empresa (multi-tenant).
3. **Assinatura/planos** (ex: Stripe) se o SaaS for pago.
4. Ligar vendas ao estoque automaticamente (baixa de ingredientes por receita).
5. Exportação de relatórios (PDF/Excel) e notificações de estoque baixo.

## Observação sobre este ambiente de desenvolvimento

Este projeto foi criado em um ambiente sandbox sem acesso à internet, então
não foi possível rodar `npm install` / `npm run dev` / `npm run build` para
testar de fato. O código foi revisado manualmente: sintaxe de todos os
arquivos `.ts/.tsx` (via TypeScript compiler, sem erros), imports não
utilizados (nenhum encontrado) e nomes de todos os ícones `lucide-react`
usados (confirmados via documentação oficial, incluindo renomeações recentes
como `ArrowUpCircle` → `CircleArrowUp`). Ainda assim, recomendamos rodar
`npm install && npm run build` no seu ambiente antes de publicar.
