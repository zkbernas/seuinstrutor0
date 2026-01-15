# 💰 Guia de Integração SaaS - SeuInstrutor

## Modelo de Negócio

O SeuInstrutor é um SaaS por **planos mensais sem comissão**.

### Planos Atuais

| Plano | Preço/mês | Alunos Ativos | Status |
|-------|-----------|---------------|--------|
| **Starter** | R$ 197 | Até 10 | Implementado (mock) |
| **Pro** | R$ 297 | Até 20 | Implementado (mock) |
| **Scale** | R$ 497 | Até 50 | Implementado (mock) |

### Features por Plano

**Starter (R$ 197/mês)**
- Até 10 alunos ativos
- Agenda básica
- Pagamentos integrados
- 1 WhatsApp
- Dashboard simples

**Pro (R$ 297/mês)** - Mais Popular
- Até 20 alunos ativos
- Relatórios financeiros
- Confirmações automáticas
- 2 WhatsApps
- Regras de cancelamento/remarcação
- Dashboard avançado

**Scale (R$ 497/mês)**
- Até 50 alunos ativos
- Agenda avançada
- Relatórios completos
- 3 WhatsApps
- Automação total
- Suporte prioritário
- API de integração

---

## Como Funciona (Mock Atual)

### BillingContext - Estado Global

Arquivo: `src/billing/BillingContext.tsx`

```typescript
// Simular diferentes cenários (linhas 56-63):

// Status da assinatura
const [status, setStatus] = useState<BillingStatus>('trial');
// Opções: 'none' | 'trial' | 'active' | 'past_due' | 'canceled'

// Plano atual
const [plan, setPlan] = useState<BillingPlan>('starter');
// Opções: 'starter' | 'pro' | 'scale' | null

// Número de alunos ativos (mock)
const [activeStudentsCount] = useState(0);
// Altere para testar limites (ex: 8, 15, 45)
```

### Limites de Planos

Definidos em `PLAN_LIMITS`:

```typescript
PLAN_LIMITS.starter.maxActiveStudents = 10
PLAN_LIMITS.pro.maxActiveStudents = 20
PLAN_LIMITS.scale.maxActiveStudents = 50
```

---

## Componentes Disponíveis

### 1. PlanBadge

Exibe o plano atual do usuário.

```tsx
import { PlanBadge } from '../../billing/components/PlanBadge';

// Básico
<PlanBadge />

// Com preço
<PlanBadge showPrice />

// Plano específico
<PlanBadge plan="pro" showPrice />
```

**Onde usar:**
- Topbar (já implementado)
- Dashboard
- Perfil do usuário

### 2. UsageMeter

Barra de progresso de uso de alunos.

```tsx
import { UsageMeter } from '../../billing/components/UsageMeter';

// Completo com detalhes
<UsageMeter showDetails />

// Simples
<UsageMeter />
```

**Lógica:**
- Verde: < 80% do limite
- Amarelo: 80-99% do limite
- Vermelho: 100% (limite atingido)
- Avisos automáticos

**Onde usar:**
- Dashboard (já implementado)
- Página de alunos
- Antes de adicionar novo aluno

### 3. FeatureGate

Controla acesso a features por plano.

```tsx
import { FeatureGate } from '../../billing/components/FeatureGate';

// Bloquear feature para planos inferiores
<FeatureGate requiredPlan="pro">
  <AdvancedReportsComponent />
</FeatureGate>

// Com fallback customizado
<FeatureGate 
  requiredPlan="scale" 
  feature="API de integração"
  fallback={<MyCustomUpgradeBanner />}
>
  <APIDocumentation />
</FeatureGate>
```

**Hierarquia de Planos:**
```
starter (nível 1) < pro (nível 2) < scale (nível 3)
```

Se requiredPlan="pro", starter não tem acesso, mas pro e scale têm.

**Onde usar:**
- Módulos inteiros (Aulas avançadas, Relatórios)
- Funcionalidades específicas (Multi-WhatsApp, Automações)
- Limites de recursos

### 4. PaywallBanner

Banner CTA para upgrade.

```tsx
import { PaywallBanner } from '../../billing/PaywallBanner';

<PaywallBanner 
  feature="relatórios avançados"
  showBanner={true}
/>
```

**Usado automaticamente por:**
- FeatureGate (quando não tem acesso)
- UsageMeter (quando atinge limite)

---

## Hook useBilling

```tsx
import { useBilling } from '../../billing/BillingContext';

function MyComponent() {
  const {
    plan,              // 'starter' | 'pro' | 'scale' | null
    status,            // 'trial' | 'active' | 'past_due' | etc
    isActive,          // boolean - se pode usar o sistema
    usage,             // { activeStudents, maxStudents }
    canAddStudent,     // boolean - se pode adicionar mais alunos
    getPlanLimits,     // () => limites do plano atual
    subscribe,         // (plan) => Promise<void>
    cancelSubscription, // () => Promise<void>
  } = useBilling();

  // Exemplo: verificar se pode adicionar aluno
  if (!canAddStudent) {
    return <UpgradePrompt />;
  }

  // Exemplo: mostrar features do plano
  const limits = getPlanLimits();
  console.log(limits.features);
}
```

---

## Exemplos de Uso

### Bloquear cadastro de aluno por limite

```tsx
function StudentForm() {
  const { canAddStudent, usage, plan } = useBilling();
  const limits = useBilling().getPlanLimits();

  if (!canAddStudent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-900 mb-2">
          Limite de alunos atingido
        </h3>
        <p className="text-sm text-red-700 mb-3">
          Você atingiu o limite de {usage.maxStudents} alunos do plano {limits?.name}.
        </p>
        <Button onClick={() => navigate('/app/billing')}>
          Fazer upgrade
        </Button>
      </div>
    );
  }

  return <StudentFormFields />;
}
```

### Mostrar preview de features bloqueadas

```tsx
function AdvancedReports() {
  return (
    <FeatureGate requiredPlan="pro" feature="relatórios avançados">
      <div>
        <h2>Relatórios Financeiros</h2>
        <ReportCharts />
        <ExportButtons />
      </div>
    </FeatureGate>
  );
}
```

### Badge de status no dashboard

```tsx
function DashboardHeader() {
  const { status, plan } = useBilling();

  return (
    <div className="flex items-center gap-3">
      <h1>Dashboard</h1>
      <PlanBadge />
      {status === 'trial' && (
        <Badge variant="warning">Trial - 7 dias grátis</Badge>
      )}
      {status === 'past_due' && (
        <Badge variant="error">Pagamento pendente</Badge>
      )}
    </div>
  );
}
```

---

## Integração Real (Próximos Passos)

### Backend Endpoints Necessários

```
GET    /api/subscriptions/current     - Status da assinatura
POST   /api/subscriptions            - Criar assinatura
DELETE /api/subscriptions/:id        - Cancelar assinatura
PATCH  /api/subscriptions/payment    - Atualizar método de pagamento

GET    /api/students/count            - Contar alunos ativos
```

### Gateway de Pagamento

**Opções:**
1. **Stripe** - Internacional, completo
2. **Mercado Pago** - Brasil, fácil
3. **PagSeguro** - Brasil, popular

**Fluxo:**
1. Usuário clica "Assinar Pro"
2. Frontend chama `subscribe('pro')`
3. Backend cria checkout session no gateway
4. Redirect para página de pagamento
5. Webhook confirma pagamento
6. Backend atualiza status → 'active'
7. Frontend recarrega contexto

### Atualizar BillingContext

Substituir mock por API real:

```typescript
// Em vez de useState mock:
const { data } = useQuery({
  queryKey: ['subscription'],
  queryFn: () => fetch('/api/subscriptions/current').then(r => r.json()),
});

const status = data?.status || 'none';
const plan = data?.plan || null;
```

### Webhook Handler

Backend precisa receber eventos do gateway:

```typescript
// POST /webhooks/stripe (ou /webhooks/mercadopago)
async handleWebhook(event) {
  if (event.type === 'payment_succeeded') {
    await updateSubscriptionStatus(event.customerId, 'active');
  }
  if (event.type === 'payment_failed') {
    await updateSubscriptionStatus(event.customerId, 'past_due');
  }
}
```

---

## Testando Limites

### Cenário 1: Trial Starter - 0 alunos
```typescript
// BillingContext.tsx
status: 'trial',
plan: 'starter',
activeStudentsCount: 0
```
**Esperado:** Tudo funciona, pode adicionar até 10 alunos

### Cenário 2: Starter - 9 alunos (perto do limite)
```typescript
status: 'active',
plan: 'starter',
activeStudentsCount: 9
```
**Esperado:** Aviso amarelo "próximo do limite"

### Cenário 3: Starter - 10 alunos (no limite)
```typescript
status: 'active',
plan: 'starter',
activeStudentsCount: 10
```
**Esperado:** 
- Aviso vermelho "limite atingido"
- `canAddStudent = false`
- Botão "Adicionar aluno" desabilitado

### Cenário 4: Pro - 15 alunos
```typescript
status: 'active',
plan: 'pro',
activeStudentsCount: 15
```
**Esperado:** Funciona normal (limite = 20)

### Cenário 5: Sem pagamento
```typescript
status: 'past_due',
plan: 'pro',
activeStudentsCount: 10
```
**Esperado:**
- Badge "Pagamento pendente"
- Funções bloqueadas
- Banner para regularizar

---

## Métricas e Analytics

Para acompanhar o negócio, adicione tracking de:

1. **Conversões de Trial → Pago**
2. **Upgrades** (starter → pro → scale)
3. **Churn** (cancelamentos)
4. **MRR** (Monthly Recurring Revenue)
5. **Uso médio** (alunos por plano)

Eventos importantes:
- `subscription_created`
- `subscription_upgraded`
- `subscription_downgraded`
- `subscription_canceled`
- `limit_reached` (tentou adicionar aluno no limite)

---

## Perguntas Frequentes

**Q: Como mudar o plano de teste?**
A: Edite `BillingContext.tsx`, linha 57-58 (plan e status)

**Q: Como simular limite atingido?**
A: Ajuste `activeStudentsCount` para >= `maxActiveStudents` do plano

**Q: FeatureGate funciona sem API?**
A: Sim! Usa o mock do BillingContext

**Q: Como adicionar novo plano (ex: Enterprise)?**
A: 
1. Adicione em `PLAN_LIMITS` (BillingContext.tsx)
2. Adicione card em BillingPlansPage.tsx
3. Atualize hierarquia em FeatureGate.tsx

**Q: Como integrar Stripe?**
A: Ver documentação oficial + exemplo em `docs/stripe-integration.md` (criar)

---

**Status:** Sistema SaaS funcional em modo mock, pronto para integração real de pagamentos.
