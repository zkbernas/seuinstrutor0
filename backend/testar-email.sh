#!/bin/bash

# Script Bash para testar o envio de email

echo "========================================"
echo "  TESTE DE EMAIL - RESEND"
echo "========================================"
echo ""

# Verificar se o servidor está rodando
echo "Testando conexão com o servidor..."

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404"; then
    echo "✓ Servidor está rodando!"
else
    echo "✗ ERRO: Servidor não está rodando!"
    echo "Por favor, inicie o servidor com: npm run start:dev"
    exit 1
fi

echo ""
echo "Enviando email de teste..."
echo ""

# Enviar email de teste
response=$(curl -X POST http://localhost:3000/email/test-welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"berproenccaa@gmail.com","name":"Bernardo"}' \
  -w "\n%{http_code}" -s)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 201 ] || [ "$http_code" -eq 200 ]; then
    echo "========================================"
    echo "  ✓ EMAIL ENVIADO COM SUCESSO!"
    echo "========================================"
    echo ""
    echo "Verifique a caixa de entrada de: berproenccaa@gmail.com"
    echo "Não esqueça de verificar a pasta de SPAM!"
    echo ""
    echo "Resposta: $body"
    echo ""
    echo "Dashboard: https://resend.com/emails"
    echo ""
else
    echo "========================================"
    echo "  ✗ ERRO AO ENVIAR EMAIL"
    echo "========================================"
    echo ""
    echo "Código HTTP: $http_code"
    echo "Resposta: $body"
    echo ""
    echo "Possíveis causas:"
    echo "1. Arquivo .env não foi criado"
    echo "2. API Key incorreta no .env"
    echo "3. Servidor não foi reiniciado após criar .env"
    echo ""
    echo "Consulte: CONFIGURACAO_FINAL.md"
    echo ""
    exit 1
fi

