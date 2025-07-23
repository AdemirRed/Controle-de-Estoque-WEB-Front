#!/bin/bash

# 🚀 Script de Deploy para Verificação Zoho

echo "🔐 Iniciando deploy para verificação de domínio Zoho..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto!"
    exit 1
fi

# Verificar se o arquivo de verificação existe
if [ ! -f "zohoverify/verifyforzoho.html" ]; then
    echo "❌ Erro: Arquivo verifyforzoho.html não encontrado!"
    exit 1
fi

echo "✅ Arquivo de verificação encontrado: $(cat zohoverify/verifyforzoho.html)"

# Adicionar arquivos ao git
echo "📦 Adicionando arquivos ao git..."
git add .

# Commit
echo "💾 Fazendo commit..."
git commit -m "Add Zoho domain verification file and configuration"

# Push para o repositório
echo "🚀 Enviando para o repositório..."
git push origin main

echo ""
echo "✅ Deploy realizado com sucesso!"
echo ""
echo "🌐 Aguarde alguns minutos e verifique:"
echo "   https://universoredblack.com.br/zohoverify/verifyforzoho.html"
echo ""
echo "📋 O arquivo deve mostrar apenas: $(cat zohoverify/verifyforzoho.html)"
echo ""
echo "🔐 Após confirmar que o arquivo está acessível:"
echo "   1. Volte para o painel do Zoho"
echo "   2. Clique em 'Verificar arquivo HTML'"
echo "   3. Aguarde a confirmação"
echo ""
