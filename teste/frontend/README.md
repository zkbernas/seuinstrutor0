# SeuInstrutor - Frontend

**Sistema SaaS completo de gestão para instrutores de trânsito**

*"O sistema que organiza sua agenda, seus alunos e seu dinheiro"*

Interface moderna e premium construída com React, TypeScript e Tailwind CSS, totalmente integrada ao backend NestJS.

## 🚀 Stack Tecnológica

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router v6** - Roteamento
- **React Query (TanStack Query)** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

**IMPORTANTE:** Ajuste a URL da API conforme seu ambiente:
- Desenvolvimento local: `http://localhost:3000`
- Produção: `https://api.seudominio.com`

### Ajuste do Token de Autenticação

O backend retorna o token no formato `{ access_token, user }`.

Se seu backend usar um nome diferente para o token (`token`, `accessToken`, etc.), ajuste em:

```typescript
// src/api/endpoints/auth.ts - linhas 20-45

// Formato atual (access_token)
if (responseData.access_token) {
  return responseData as LoginResponse;
}

// Adicione seu formato se necessário
```

## 🏃 Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

O projeto estará disponível em `http://localhost:5173`

## 💰 Modelo de Negócio SaaS

O SeuInstrutor é um SaaS por planos mensais (sem comissão). Os planos são:

### Planos Disponíveis

**Starter - R$ 197/mês**
- Até 10 alunos ativos
- Agenda básica
- Pagamentos integrados
- 1 WhatsApp
- Dashboard simples

**Pro - R$ 297/mês** (Mais popular)
- Até 20 alunos ativos
- Relatórios financeiros
- Confirmações automáticas
- 2 WhatsApps
- Regras de cancelamento/remarcação
- Dashboard avançado

**Scale - R$ 497/mês**
- Até 50 alunos ativos
- Agenda avançada
- Relatórios completos
- 3 WhatsApps
- Automação total
- Suporte prioritário
- API de integração

### Sistema de Billing (Mock)

Atualmente o sistema de billing está em modo mock para testes. Para simular diferentes cenários:

**Arquivo:** `src/billing/BillingContext.tsx`

```typescript
// Linha 56-58: Altere para testar diferentes estados
const [status, setStatus] = useState<BillingStatus>('trial'); 
// Opções: 'trial' | 'active' | 'past_due' | 'canceled' | 'none'

const [plan, setPlan] = useState<BillingPlan>('starter');
// Opções: 'starter' | 'pro' | 'scale' | null

const [activeStudentsCount] = useState(0);
// Altere para testar limites de alunos
```

**Componentes de Billing:**
- `PlanBadge` - Mostra o plano atual
- `UsageMeter` - Barra de uso de alunos
- `FeatureGate` - Controle de acesso por plano
- `PaywallBanner` - CTA para upgrade

## 📁 Estrutura de Pastas

```
src/
├── api/                    # Camada de API
│   ├── endpoints/          # Endpoints organizados por domínio
│   │   ├── auth.ts
│   │   └── instructors.ts
│   ├── http.ts            # Configuração Axios + interceptors
│   └── types.ts           # Tipos TypeScript da API
│
├── app/                   # Configuração da aplicação
│   ├── layout/            # Layout principal
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── providers/         # Providers globais
│   │   └── Providers.tsx
│   └── routes/            # Configuração de rotas
│       └── router.tsx
│
├── auth/                  # Sistema de autenticação
│   ├── AuthContext.tsx    # Context e hooks
│   ├── auth.storage.ts    # LocalStorage helpers
│   └── guards.tsx         # Guards de rota (Protected/Public)
│
├── billing/               # Sistema de pagamentos SaaS
│   ├── BillingContext.tsx    # Context com planos reais
│   ├── PaywallBanner.tsx     # CTA upgrade
│   └── components/
│       ├── PlanBadge.tsx     # Badge do plano
│       ├── UsageMeter.tsx    # Barra de uso
│       └── FeatureGate.tsx   # Controle de acesso
│
├── components/            # Componentes reutilizáveis
│   ├── common/            # Componentes comuns
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   └── PageHeader.tsx
│   └── ui/                # Componentes de UI base
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── MultiSelect.tsx
│       ├── Select.tsx
│       ├── Skeleton.tsx
│       ├── Table.tsx
│       └── Toast.tsx
│
├── pages/                 # Páginas da aplicação
│   ├── app/               # Páginas autenticadas
│   │   ├── instructors/
│   │   │   └── CreateInstructorModal.tsx
│   │   ├── BillingPlansPage.tsx
│   │   ├── ClassesPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── InstructorDetailsPage.tsx
│   │   ├── InstructorsPage.tsx
│   │   └── SettingsPage.tsx
│   └── public/            # Páginas públicas
│       └── LoginPage.tsx
│
├── styles/                # Estilos globais
│   └── globals.css
│
├── utils/                 # Utilitários
│   ├── cn.ts             # Class names (clsx + tailwind-merge)
│   ├── format.ts         # Formatadores (CPF, telefone, moeda)
│   └── masks.ts          # Máscaras de input
│
├── env.d.ts              # Tipos do ambiente
└── main.tsx              # Entry point
```

## 🔐 Autenticação

### Fluxo de Login

1. Usuário envia credenciais via `POST /auth/login`
2. Backend retorna `{ access_token, user }`
3. Token é salvo no `localStorage` (chave: `access_token`)
4. Axios interceptor adiciona token em todas requisições
5. Em caso de 401, usuário é redirecionado para `/login`

### Guards de Rota

- **PublicRoute**: Redireciona para `/app` se autenticado (usado em `/login`)
- **ProtectedRoute**: Redireciona para `/login` se não autenticado (usado em `/app/*`)

## 📋 Funcionalidades Implementadas

### ✅ Login e Autenticação
- Validação com Zod
- Gestão de token automática
- Redirecionamento inteligente
- Feedback de erros amigável

### ✅ Dashboard
- Métricas em tempo real (total de instrutores)
- Cards de estatísticas (preparados para expansão)
- Ações rápidas
- Estado vazio com CTA

### ✅ Gestão de Instrutores (COMPLETO)
- **Listagem**
  - Tabela responsiva com todas informações
  - Busca por nome, e-mail, CPF ou telefone
  - Estados de loading e empty
  - Paginação preparada

- **Cadastro**
  - Modal com validação completa
  - Máscaras automáticas (CPF, telefone)
  - Multi-select de categorias com chips
  - Validação em tempo real
  - Campos:
    - Nome, e-mail, senha
    - CPF (com máscara)
    - Número da credencial
    - Telefone (com máscara)
    - Valor por hora
    - Categorias (multi-select)

- **Detalhes**
  - Visualização completa de informações
  - Cards organizados por tipo de informação
  - Estatísticas (preparadas para integração)
  - Breadcrumb e navegação

- **Exclusão**
  - Confirmação antes de excluir
  - Feedback de sucesso/erro
  - Invalidação de cache automática

### ✅ Sistema de Billing SaaS (Integrado e Funcional)
- **Planos de Assinatura (Modelo Real)**
  - Starter: R$ 197/mês - até 10 alunos
  - Pro: R$ 297/mês - até 20 alunos (mais popular)
  - Scale: R$ 497/mês - até 50 alunos
  - Toggle mensal/anual (desconto de 20%)
  - Cards premium com features do negócio
  - Sistema de upgrade/downgrade

- **Infraestrutura (Funcional)**
  - `BillingContext` com modelo de negócio real
  - `PlanBadge` - exibe plano atual no Topbar
  - `UsageMeter` - controle de alunos ativos
  - `FeatureGate` - bloqueio por plano
  - `PaywallBanner` - CTA upgrade
  - Mock funcional (fácil integrar API real)
  - Preparado para: Stripe, Mercado Pago, PagSeguro

### ✅ Placeholders
- **Aulas**: Layout completo com features futuras
- **Configurações**: Perfil básico + seções preparadas

## 🎨 Design System

### Paleta de Cores

```javascript
// Primary (Lime/Green)
primary-50  → #f7fee7
primary-500 → #84cc16
primary-600 → #65a30d (principal)

// Grays (Neutral)
gray-50  → #fafafa
gray-900 → #18181b
```

### Componentes UI

Todos os componentes seguem o padrão:
- Estados visuais: hover, focus, disabled, loading
- Acessibilidade: ARIA labels, focus ring, keyboard navigation
- Variantes: primary, secondary, outline, ghost, danger
- Tamanhos: sm, md, lg

### Tipografia

```css
h1 → 3xl/4xl, font-semibold
h2 → 2xl/3xl, font-semibold
h3 → xl/2xl, font-semibold
```

## 🔌 Integração com API

### Endpoints Implementados

```typescript
// Auth
POST   /auth/login              → { access_token, user }

// Instructors
GET    /instructors             → Instructor[]
GET    /instructors/:id         → Instructor
POST   /instructors             → Instructor
PATCH  /instructors/:id         → Instructor
DELETE /instructors/:id         → void
```

### Adicionando Novos Endpoints

1. **Criar tipos** em `src/api/types.ts`:
```typescript
export interface MyEntity {
  id: string;
  name: string;
}
```

2. **Criar endpoint** em `src/api/endpoints/myEntity.ts`:
```typescript
import { http } from '../http';
import type { MyEntity } from '../types';

export const myEntityApi = {
  list: async (): Promise<MyEntity[]> => {
    const response = await http.get<MyEntity[]>('/my-entities');
    return response.data;
  },
};
```

3. **Usar com React Query**:
```typescript
const { data } = useQuery({
  queryKey: ['myEntities'],
  queryFn: myEntityApi.list,
});
```

## 🎯 Próximos Passos

### Backend Necessário

Para funcionalidades futuras, adicione estes endpoints:

```
# Aulas
GET    /classes
POST   /classes
GET    /classes/:id
PATCH  /classes/:id
DELETE /classes/:id

# Alunos
GET    /students
POST   /students
GET    /students/:id
PATCH  /students/:id
DELETE /students/:id

# Billing
POST   /subscriptions
GET    /subscriptions/current
DELETE /subscriptions/:id
POST   /webhooks/payment
```

### Features Preparadas

1. **Sistema de Aulas**: Toda estrutura de rotas e UI pronta
2. **Pagamentos**: Context, componentes e fluxo preparados
3. **Notificações**: Toast system completo e extensível
4. **Configurações**: Layout de settings estruturado

## 🐛 Troubleshooting

### Erro: "Token não encontrado na resposta"

Ajuste o nome do campo do token em `src/api/endpoints/auth.ts` conforme seu backend.

### Erro: Network Error

1. Verifique se o backend está rodando
2. Confirme a URL em `.env` (`VITE_API_URL`)
3. Verifique CORS no backend

### Erro: 401 Unauthorized

1. Limpe o localStorage: `localStorage.clear()`
2. Faça login novamente
3. Verifique se o token está sendo enviado (Network tab)

## 📝 Padrões de Código

### Nomenclatura

- Componentes: `PascalCase` (ex: `Button.tsx`)
- Hooks: `camelCase` com prefixo `use` (ex: `useAuth`)
- Utils: `camelCase` (ex: `formatCPF`)
- Types: `PascalCase` (ex: `User`, `Instructor`)

### Imports

Ordem preferida:
1. React e libs externas
2. Contextos e hooks customizados
3. Componentes
4. Utils e tipos
5. Estilos

### Commits

Siga Conventional Commits:
```
feat: adiciona página de relatórios
fix: corrige máscara de CPF
docs: atualiza README
style: ajusta espaçamento do modal
refactor: reorganiza estrutura de pastas
```

## 🤝 Contribuindo

1. Mantenha a estrutura de pastas existente
2. Siga os padrões de código estabelecidos
3. Adicione validação Zod em todos os formulários
4. Use React Query para chamadas de API
5. Crie componentes reutilizáveis quando aplicável
6. Documente funções complexas
7. Teste em diferentes resoluções

## 📄 Licença

Proprietário - SeuInstrutor © 2026

---

**Desenvolvido com ❤️ usando as melhores práticas de engenharia front-end**

Para dúvidas ou sugestões, consulte a documentação inline nos arquivos principais.
