# 🚨 URGENTE - NETLIFY USANDO URL ERRADA

## ❌ PROBLEMA IDENTIFICADO:
O Netlify está usando `https://universoredblack.com.br` em vez de `https://controle-de-estoque-web-api.onrender.com`

## 🔧 SOLUÇÃO IMEDIATA:

### 1. Acesse o Painel do Netlify:
- Site: https://app.netlify.com/
- Encontre seu projeto

### 2. Environment Variables (CRÍTICO):
- Vá em **Site Settings** → **Environment Variables**
- **REMOVA** todas as variáveis que apontam para:
  - `universoredblack.com.br`
  - `redblackspy.ddns.net`
  - Qualquer URL que não seja do Render

### 3. Configure as variáveis corretas:
```
VITE_API_URL = https://controle-de-estoque-web-api.onrender.com
VITE_WS_URL = wss://controle-de-estoque-web-api.onrender.com
VITE_ENV = production
```

### 4. Build Settings (verifique também):
- Vá em **Site Settings** → **Build & Deploy**
- Verifique se não há variáveis antigas em "Build environment variables"

### 5. Force Deploy:
- Vá em **Deploys**
- Clique em **Trigger deploy**
- Selecione **Clear cache and deploy site**
- **AGUARDE** o deploy terminar (pode levar alguns minutos)

## 🧪 TESTE APÓS O DEPLOY:

### Verifique no Console do Browser:
1. Abra F12 → Console
2. Procure por logs do tipo:
   ```
   🔧 DEBUG API CONFIG:
   VITE_API_URL: https://controle-de-estoque-web-api.onrender.com
   ```

### Network Tab:
3. F12 → Network
4. Tente fazer login
5. Verifique se as requisições vão para `controle-de-estoque-web-api.onrender.com`

## 📝 CHECKLIST:

- [ ] Environment Variables atualizadas no Netlify
- [ ] Build environment variables verificadas
- [ ] Clear cache and deploy executado
- [ ] Deploy finalizado com sucesso
- [ ] Console mostra URL correta
- [ ] Network requests vão para o Render
- [ ] Login funciona

## 🆘 SE AINDA NÃO FUNCIONAR:

1. **Verifique o Domain Settings** - pode ter configurações de API customizadas
2. **_redirects file** - pode estar sobrescrevendo as rotas
3. **netlify.toml** - verifique se não há redirects antigos

⚠️ **IMPORTANTE:** O problema é 100% configuração do Netlify, não do código!
