@echo off
cd /d %~dp0

:: Só instala se a pasta node_modules não existir
if not exist node_modules (
    echo Instalando dependências...
    npm install
)

:: Roda o frontend em background e fecha o terminal
start "" /b yarn dev

exit
