@echo off
echo 🔐 Iniciando deploy para verificação de domínio Zoho...

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto!
    pause
    exit /b 1
)

REM Verificar se o arquivo de verificação existe
if not exist "zohoverify\verifyforzoho.html" (
    echo ❌ Erro: Arquivo verifyforzoho.html não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivo de verificação encontrado
type zohoverify\verifyforzoho.html

REM Adicionar arquivos ao git
echo 📦 Adicionando arquivos ao git...
git add .

REM Commit
echo 💾 Fazendo commit...
git commit -m "Add Zoho domain verification file and configuration"

REM Push para o repositório
echo 🚀 Enviando para o repositório...
git push origin main

echo.
echo ✅ Deploy realizado com sucesso!
echo.
echo 🌐 Aguarde alguns minutos e verifique:
echo    https://universoredblack.com.br/zohoverify/verifyforzoho.html
echo.
echo 📋 O arquivo deve mostrar apenas o código de verificação
echo.
echo 🔐 Após confirmar que o arquivo está acessível:
echo    1. Volte para o painel do Zoho
echo    2. Clique em 'Verificar arquivo HTML'
echo    3. Aguarde a confirmação
echo.
pause
