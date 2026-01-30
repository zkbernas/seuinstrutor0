# 🚀 Início Rápido - Resend Email

## ⚡ 3 Passos para Começar

### 📌 Passo 1: Obter sua API Key (5 minutos)

1. Acesse: **https://resend.com**
2. Clique em **Sign Up** (Cadastrar)
3. Após login, vá em **API Keys** (no menu lateral)
4. Clique no botão **Create API Key**
5. Copie a chave que começa com `re_...`

---

### 📌 Passo 2: Configurar no Projeto (1 minuto)

Crie o arquivo `.env` na pasta `backend` com este conteúdo:

```env
RESEND_API_KEY="cole_sua_chave_aqui"
RESEND_FROM_EMAIL="onboarding@resend.dev"
FRONTEND_URL="http://localhost:5173"
```

**⚠️ IMPORTANTE**: Cole a chave que você copiou no passo 1!

---

### 📌 Passo 3: Testar (2 minutos)

#### 3.1 - Inicie o servidor (se não estiver rodando)

```bash
cd backend
npm run start:dev
```

#### 3.2 - Teste o envio

**Opção A: Abra o navegador e use extensão REST Client**

Abra o arquivo `email-tests.http` e clique em "Send Request"

**Opção B: Use o PowerShell/CMD**

```powershell
curl -X POST http://localhost:3000/email/test-welcome -H "Content-Type: application/json" -d "{\"email\":\"berproenccaa@gmail.com\",\"name\":\"Teste\"}"
```

**Opção C: Use Postman/Insomnia**

```
POST http://localhost:3000/email/test-welcome
Content-Type: application/json

{
  "email": "berproenccaa@gmail.com",
  "name": "Seu Nome"
}
```

#### 3.3 - Verifique seu email

Abra sua caixa de entrada e veja o email de boas-vindas! 📧

---

## ✅ Está Funcionando?

Se você recebeu o email, **parabéns!** A integração está completa! 🎉

Agora você pode:

### 🔥 Endpoints Disponíveis para Testar

| URL | Descrição | Teste |
|-----|-----------|-------|
| `POST /email/test-welcome` | Email de boas-vindas | ✉️ Básico |
| `POST /email/test-verification` | Email de verificação | 🔐 Segurança |
| `POST /email/test-reset-password` | Reset de senha | 🔑 Recuperação |
| `POST /email/test-lesson` | Notificação de aula | 📅 Funcional |

### 📖 Usar no seu Código

**Exemplo: Enviar email ao criar usuário**

```typescript
// 1. Adicione no módulo que vai usar
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, EmailModule], // ← Adicione aqui
  // ...
})

// 2. Injete no service
constructor(
  private emailService: EmailService, // ← Adicione aqui
) {}

// 3. Use onde precisar
await this.emailService.sendWelcomeEmail(
  'usuario@email.com',
  'Nome do Usuário'
);
```

---

## 🆘 Problemas?

### ❌ Erro: "RESEND_API_KEY não configurada"

**Solução**: Você esqueceu de criar o arquivo `.env` ou não reiniciou o servidor.

1. Crie o `.env` na pasta `backend`
2. Cole sua API key
3. Reinicie: `Ctrl+C` e depois `npm run start:dev`

---

### ❌ Erro: "API Key inválida"

**Solução**: A chave está errada ou mal copiada.

1. Volte ao dashboard do Resend
2. Copie a chave novamente (cuidado com espaços)
3. Cole no `.env`
4. Reinicie o servidor

---

### ❌ Email não chega

**Soluções**:

1. ✅ Verifique a pasta de **SPAM**
2. ✅ Confirme que o email de destino está correto
3. ✅ Veja o dashboard: https://resend.com/emails
4. ✅ Veja os logs do terminal do backend

---

### ❌ "Rate limit exceeded"

**Solução**: Você excedeu o limite gratuito de 100 emails/dia.

1. Aguarde até amanhã OU
2. Faça upgrade no plano do Resend

---

## 📚 Documentação Completa

- **Configuração Detalhada**: `RESEND_SETUP.md`
- **Documentação do Módulo**: `src/email/README.md`
- **Exemplos de Integração**: `src/email/INTEGRATION_EXAMPLES.md`
- **Resumo Completo**: `RESEND_INTEGRATION_SUMMARY.md`

---

## 🎯 Próximos Passos

1. ✅ Integre o email no módulo de autenticação (registro de usuário)
2. ✅ Adicione notificação ao agendar aulas
3. ✅ Implemente reset de senha com email
4. ✅ (Produção) Configure seu próprio domínio

---

## 💡 Dica Final

**Para Produção:**

1. Configure um domínio personalizado no Resend
2. Use um email profissional: `noreply@seudominio.com`
3. Configure SPF, DKIM e DMARC
4. Monitore o dashboard regularmente

---

## ✨ Tudo Pronto!

Sua integração com Resend está **100% funcional**! 

Se tiver dúvidas, consulte a documentação completa nos arquivos listados acima.

**Boa sorte com seu projeto! 🚀**

