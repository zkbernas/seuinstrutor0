# 📧 Como Usar o Sistema de Email

## 🎯 Para que serve?

Este sistema permite que seu site envie emails automaticamente para os usuários, como:

- ✉️ Email de boas-vindas quando alguém se cadastra
- 🔐 Email de verificação de conta
- 🔑 Email para redefinir senha
- 📅 Notificação quando uma aula é agendada
- 📨 Qualquer outro email que você precisar

---

## ⚙️ Configuração (Faça UMA VEZ)

### Passo 1: Criar conta no Resend

1. Abra seu navegador e vá em: **https://resend.com**
2. Clique em **"Sign Up"** (Cadastrar)
3. Preencha seus dados e crie a conta
4. Confirme seu email

### Passo 2: Pegar sua chave de API

1. Depois de fazer login, procure no menu lateral: **"API Keys"**
2. Clique no botão **"Create API Key"**
3. Dê um nome para a chave (por exemplo: "SeuInstrutor")
4. **COPIE** a chave que aparece (ela começa com `re_...`)
5. ⚠️ **IMPORTANTE**: Guarde essa chave, você vai precisar dela!

### Passo 3: Configurar no seu projeto

1. Abra a pasta `backend` do seu projeto
2. Crie um arquivo chamado `.env` (se ainda não existir)
3. Adicione estas linhas no arquivo:

```
RESEND_API_KEY="cole_aqui_a_chave_que_voce_copiou"
RESEND_FROM_EMAIL="onboarding@resend.dev"
FRONTEND_URL="http://localhost:5173"
```

4. **Salve o arquivo**

### Passo 4: Reiniciar o servidor

No terminal, dentro da pasta `backend`:

```bash
npm run start:dev
```

---

## 🧪 Testar se está funcionando

### Teste Rápido

Abra o PowerShell ou CMD e execute:

```powershell
curl -X POST http://localhost:3000/email/test-welcome -H "Content-Type: application/json" -d "{\"email\":\"seu@email.com\",\"name\":\"Seu Nome\"}"
```

**Troque** `seu@email.com` pelo seu email real!

Depois, **verifique sua caixa de entrada** (e também a pasta de spam).

Se você recebeu o email, **PARABÉNS!** Está tudo funcionando! 🎉

---

## 💻 Como usar no código

### Exemplo 1: Enviar email quando alguém se cadastra

```typescript
// No arquivo: src/auth/auth.service.ts

// 1. Primeiro, importe o serviço de email (no topo do arquivo)
import { EmailService } from '../email/email.service';

// 2. Adicione no constructor
constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
  private emailService: EmailService, // ← Adicione esta linha
) {}

// 3. No método de registro, após criar o usuário, adicione:
async register(dto: RegisterDto) {
  // ... código que cria o usuário ...
  
  // Enviar email de boas-vindas
  try {
    await this.emailService.sendWelcomeEmail(
      user.email,  // Email do usuário
      user.name    // Nome do usuário
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    // Não precisa parar o cadastro se o email falhar
  }
  
  // ... resto do código ...
}
```

### Exemplo 2: Enviar notificação quando uma aula é agendada

```typescript
// No arquivo: src/lessons/lessons.service.ts

// 1. Importar o serviço
import { EmailService } from '../email/email.service';

// 2. Adicionar no constructor
constructor(
  private prisma: PrismaService,
  private emailService: EmailService, // ← Adicione
) {}

// 3. Após criar a aula
async create(createLessonDto: CreateLessonDto) {
  // ... código que cria a aula ...
  
  // Enviar notificação para o aluno
  try {
    await this.emailService.sendLessonScheduledEmail(
      lesson.student.email,
      {
        studentName: lesson.student.name,
        instructorName: lesson.instructor.name,
        date: '30/01/2026',
        time: '14:00',
        duration: 60,
      }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
  
  // ... resto do código ...
}
```

### Exemplo 3: Enviar email personalizado

```typescript
// Em qualquer service que você quiser

await this.emailService.sendEmail({
  to: 'destinatario@email.com',
  subject: 'Assunto do Email',
  html: '<h1>Olá!</h1><p>Este é o conteúdo do email em HTML.</p>',
});
```

---

## 📋 Tipos de Email Disponíveis

### 1. Email de Boas-vindas

```typescript
await this.emailService.sendWelcomeEmail(
  'email@usuario.com',
  'Nome do Usuário'
);
```

### 2. Email de Verificação

```typescript
await this.emailService.sendVerificationEmail(
  'email@usuario.com',
  'token-de-verificacao-123'
);
```

### 3. Email de Reset de Senha

```typescript
await this.emailService.sendPasswordResetEmail(
  'email@usuario.com',
  'token-de-reset-123'
);
```

### 4. Notificação de Aula

```typescript
await this.emailService.sendLessonScheduledEmail(
  'email@usuario.com',
  {
    studentName: 'João Silva',
    instructorName: 'Maria Santos',
    date: '30/01/2026',
    time: '14:00',
    duration: 60, // em minutos
  }
);
```

### 5. Email Personalizado

```typescript
await this.emailService.sendEmail({
  to: 'email@usuario.com',
  subject: 'Seu Assunto Aqui',
  html: '<p>Conteúdo do email em HTML</p>',
});
```

---

## 🔍 Ver os emails enviados

Você pode ver todos os emails que foram enviados acessando:

👉 **https://resend.com/emails**

Lá você verá:
- ✅ Quais emails foram enviados
- ✅ Se foram entregues com sucesso
- ✅ Se foram abertos
- ❌ Se houve algum erro

---

## ❓ Problemas Comuns

### "RESEND_API_KEY não configurada"

**Problema**: Você esqueceu de criar o arquivo `.env` ou colocar a chave.

**Solução**:
1. Crie o arquivo `.env` na pasta `backend`
2. Adicione a linha: `RESEND_API_KEY="sua_chave_aqui"`
3. Reinicie o servidor

---

### "API Key inválida"

**Problema**: A chave que você colocou está errada.

**Solução**:
1. Volte no site do Resend
2. Copie a chave novamente (cuidado com espaços extras)
3. Cole no arquivo `.env`
4. Reinicie o servidor

---

### Email não chega

**Soluções**:
1. ✅ Verifique a **pasta de SPAM**
2. ✅ Confirme que o email está escrito corretamente
3. ✅ Veja se tem erros no terminal do backend
4. ✅ Acesse https://resend.com/emails e veja o status

---

### "Rate limit exceeded" (Limite excedido)

**Problema**: Você enviou muitos emails.

**Explicação**: O plano gratuito permite:
- 100 emails por dia
- 3.000 emails por mês

**Solução**:
- Aguarde até o dia seguinte OU
- Faça upgrade para um plano pago no Resend

---

## 💡 Dicas Importantes

### ✅ FAÇA:

- ✅ Use `try/catch` ao enviar emails (para não quebrar seu código se falhar)
- ✅ Verifique a pasta de spam ao testar
- ✅ Monitore o dashboard do Resend regularmente
- ✅ Use emails reais para testar

### ❌ NÃO FAÇA:

- ❌ Não compartilhe sua API Key com ninguém
- ❌ Não envie spam
- ❌ Não coloque a API Key no código (sempre use `.env`)
- ❌ Não esqueça de adicionar `.env` no `.gitignore`

---

## 📚 Quer saber mais?

Consulte estes arquivos para informações detalhadas:

- **INICIO_RAPIDO_RESEND.md** - Guia rápido de 3 passos
- **src/email/README.md** - Documentação técnica completa
- **src/email/INTEGRATION_EXAMPLES.md** - Mais exemplos de código
- **email-tests.http** - Arquivo com testes prontos

---

## 🎉 Pronto!

Agora você sabe como:
- ✅ Configurar o sistema de email
- ✅ Testar se está funcionando
- ✅ Usar no seu código
- ✅ Resolver problemas comuns

**Qualquer dúvida, consulte a documentação ou o dashboard do Resend!**

Boa sorte com seu projeto! 🚀

