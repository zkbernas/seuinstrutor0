# 🚀 Guia de Início Rápido

## Pré-requisitos

- Node.js 18+ instalado
- Backend rodando em `http://localhost:3000`

## Instalação e Execução (3 passos)

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar arquivo de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

Ou copie do exemplo:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 3. Iniciar o projeto

```bash
npm run dev
```

Acesse: **http://localhost:5173**

## Credenciais de Teste

Você precisará criar um usuário no backend primeiro. Use o endpoint:

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456",
  "name": "Admin"
}
```

Depois faça login com:
- **E-mail**: admin@example.com
- **Senha**: 123456

## Estrutura Rápida

```
frontend/
├── src/
│   ├── api/                    # Endpoints e configuração HTTP
│   ├── auth/                   # Sistema de autenticação
│   ├── components/
│   │   ├── ui/                 # Componentes base
│   │   └── common/             # Componentes reutilizáveis
│   ├── pages/                  # Páginas da aplicação
│   │   ├── public/             # Login
│   │   └── app/                # Dashboard, Instrutores, etc
│   └── utils/                  # Utilitários e formatadores
├── .env                        # Variáveis de ambiente
└── README.md                   # Documentação completa
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Limpar node_modules (se der problema)
rm -rf node_modules package-lock.json
npm install
```

## Problemas Comuns

### ❌ Erro: "Network Error" ou "ERR_CONNECTION_REFUSED"

**Solução**: Verifique se o backend está rodando em `http://localhost:3000`

```bash
cd ../backend
npm run start:dev
```

### ❌ Erro: "Token não encontrado"

**Solução**: Ajuste o nome do campo do token em `src/api/endpoints/auth.ts` (linhas 20-45)

### ❌ Erro: 401 Unauthorized constante

**Solução**: Limpe o localStorage

```javascript
// No console do navegador (F12)
localStorage.clear()
// Depois faça login novamente
```

## 💰 Sistema SaaS - Testando Planos

O frontend já está com o sistema SaaS completo! Para testar:

### Simular diferentes planos

Edite `src/billing/BillingContext.tsx` (linhas 56-63):

```typescript
// Exemplo 1: Trial Starter
const [status] = useState('trial');
const [plan] = useState('starter');
const [activeStudentsCount] = useState(0);

// Exemplo 2: Pro ativo com 15 alunos
const [status] = useState('active');
const [plan] = useState('pro');
const [activeStudentsCount] = useState(15);

// Exemplo 3: Starter no limite
const [status] = useState('active');
const [plan] = useState('starter');
const [activeStudentsCount] = useState(10);
```

### Planos disponíveis

- **Starter** - R$ 197/mês - até 10 alunos
- **Pro** - R$ 297/mês - até 20 alunos (mais popular)
- **Scale** - R$ 497/mês - até 50 alunos

### Componentes SaaS

- `PlanBadge` - Badge no topbar
- `UsageMeter` - Barra de uso no dashboard
- `FeatureGate` - Bloqueio por plano (veja em /app/classes)
- `PaywallBanner` - CTA upgrade

📖 Documentação completa: [SAAS_INTEGRATION.md](./SAAS_INTEGRATION.md)

## Próximos Passos

1. ✅ **Login**: Funcional
2. ✅ **Dashboard**: Copy SaaS + métricas + plano atual
3. ✅ **Gestão de Instrutores**: CRUD completo integrado
4. ✅ **Billing**: Planos reais (Starter/Pro/Scale) funcionais
5. 🚧 **Aulas**: Base preparada (com FeatureGate Pro)
6. 🔜 **Pagamentos**: Integração Stripe/Mercado Pago

## Tecnologias Principais

- **React 18** + **TypeScript**
- **Tailwind CSS** (v3) - Design system premium
- **React Router** - Navegação
- **React Query** - Estado do servidor
- **React Hook Form** + **Zod** - Formulários e validação
- **Axios** - Cliente HTTP

## Documentação Completa

Para mais detalhes, consulte o [README.md](./README.md) completo.

---

**Desenvolvido com ❤️ para SeuInstrutor**

Em caso de dúvidas, consulte a documentação inline nos arquivos ou o README completo.
