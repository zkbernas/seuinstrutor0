# Script PowerShell para testar o envio de email

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE DE EMAIL - RESEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o servidor está rodando
Write-Host "Testando conexão com o servidor..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Servidor está rodando!" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: Servidor não está rodando!" -ForegroundColor Red
    Write-Host "Por favor, inicie o servidor com: npm run start:dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Enviando email de teste..." -ForegroundColor Yellow
Write-Host ""

# Enviar email de teste
$body = @{
    email = "berproenccaa@gmail.com"
    name = "Bernardo"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/email/test-welcome" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ EMAIL ENVIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifique a caixa de entrada de: berproenccaa@gmail.com" -ForegroundColor Cyan
    Write-Host "Não esqueça de verificar a pasta de SPAM!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ID do Email: $($response.id)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Dashboard: https://resend.com/emails" -ForegroundColor Blue
    Write-Host ""
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ ERRO AO ENVIAR EMAIL" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor Yellow
    Write-Host "1. Arquivo .env não foi criado" -ForegroundColor Yellow
    Write-Host "2. API Key incorreta no .env" -ForegroundColor Yellow
    Write-Host "3. Servidor não foi reiniciado após criar .env" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Consulte: CONFIGURACAO_FINAL.md" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

