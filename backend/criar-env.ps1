# Script para criar arquivo .env

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CRIAR ARQUIVO .env" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envContent = @"
# ============================================
# CONFIGURAÇÃO DO BACKEND
# ============================================

# ===== DATABASE (Configure depois se quiser) =====
DATABASE_URL="postgresql://postgres:password@localhost:5432/seuinstrutor"

# ===== JWT =====
JWT_SECRET="seu-segredo-jwt-super-secreto-mude-isso"

# ===== RESEND EMAIL (JÁ CONFIGURADO) =====
RESEND_API_KEY="re_GBYrJtpK_8r9bcEnxiMBSnMnnxXg3af37"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# ===== FRONTEND =====
FRONTEND_URL="http://localhost:5173"

# ===== PORTA =====
PORT=3000
"@

try {
    $envPath = ".\.env"
    
    if (Test-Path $envPath) {
        Write-Host "⚠️  Arquivo .env já existe!" -ForegroundColor Yellow
        $resposta = Read-Host "Deseja sobrescrever? (s/n)"
        
        if ($resposta -ne "s" -and $resposta -ne "S") {
            Write-Host "Operação cancelada." -ForegroundColor Yellow
            exit 0
        }
    }
    
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ ARQUIVO .env CRIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Localização: $((Get-Location).Path)\.env" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔑 API Key do Resend: JÁ CONFIGURADA" -ForegroundColor Green
    Write-Host "🗄️  Banco de dados: Precisa configurar" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Cyan
    Write-Host "1. Configure o banco de dados (veja CONFIGURAR_BANCO.md)" -ForegroundColor White
    Write-Host "   OU ignore por enquanto para testar apenas o email" -ForegroundColor White
    Write-Host "2. Reinicie o servidor: npm run start:dev" -ForegroundColor White
    Write-Host "3. Teste o email: .\testar-email.ps1" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ ERRO AO CRIAR .env" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Crie manualmente o arquivo .env com este conteúdo:" -ForegroundColor Yellow
    Write-Host $envContent -ForegroundColor Gray
    Write-Host ""
    exit 1
}

