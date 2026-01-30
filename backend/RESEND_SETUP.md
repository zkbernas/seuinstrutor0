# 🚀 Guia Rápido - Configuração Resend

## 📋 Passos para Configurar

### 1️⃣ Criar conta no Resend

1. Acesse: https://resend.com
2. Crie uma conta gratuita
3. Verifique seu email

### 2️⃣ Obter API Key

1. No dashboard, vá em **API Keys**
2. Clique em **Create API Key**
3. Dê um nome (ex: "SeuInstrutor API")
4. Copie a chave gerada

### 3️⃣ Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do backend:

```env
# Resend Email Configuration
RESEND_API_KEY="re_sua_chave_aqui"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# Frontend URL (para links em emails)
FRONTEND_URL="http://localhost:5173"
```

**⚠️ Importante:** 
- Para **testes**, use `onboarding@resend.dev` como email de envio
- Para **produção**, configure seu próprio domínio no Resend

### 4️⃣ Reiniciar o Servidor

```bash
npm run start:dev
```

## 🧪 Testar Integração

### Teste Rápido com cURL

```bash
curl -X POST http://localhost:3000/email/test-welcome \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"berproenccaa@gmail.com\",\"name\":\"Teste\"}"
```

### Teste com Postman/Insomnia

```
POST http://localhost:3000/email/test-welcome
Content-Type: application/json

{
  "email": "berproenccaa@gmail.com",
  "name": "Seu Nome"
}
```

## 📧 Endpoints Disponíveis

| Endpoint | Descrição |
|----------|-----------|
| `POST /email/test-welcome` | Email de boas-vindas |
| `POST /email/test-verification` | Email de verificação |
| `POST /email/test-reset-password` | Email de redefinição de senha |
| `POST /email/test-lesson` | Notificação de aula |

## 📚 Documentação Completa

Veja: `src/email/README.md` para documentação detalhada e exemplos de integração.

## ⚡ Exemplo de Uso no Código

```typescript
import { EmailService } from './email/email.service';

@Injectable()
export class SeuService {
  constructor(private emailService: EmailService) {}

  async algumMetodo() {
    await this.emailService.sendWelcomeEmail(
      'usuario@example.com',
      'Nome do Usuário'
    );
  }
}
```

## 🔍 Verificar Emails Enviados

1. Acesse o dashboard do Resend: https://resend.com/emails
2. Veja todos os emails enviados, status de entrega, etc.

## 💡 Dicas

- ✅ Limite gratuito: 100 emails/dia e 3.000/mês
- ✅ Todos os envios são logados no console
- ✅ Emails de teste são enviados instantaneamente
- ✅ Configure um domínio personalizado para produção

## ❓ Problemas Comuns

### Erro: "API Key inválida"
- Verifique se copiou a chave corretamente
- Certifique-se que está no arquivo `.env`
- Reinicie o servidor

### Email não chega
- Verifique a pasta de spam
- Confirme que o email de destino está correto
- Veja os logs no dashboard do Resend

### Rate Limit excedido
- Verifique quantos emails você enviou hoje
- Upgrade para plano pago se necessário

