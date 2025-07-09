# CONFIGURAÇÃO NETLIFY - USAR API DO RENDER

## ✅ ARQUIVOS ATUALIZADOS

1. **`.env.production`** - Variáveis de ambiente para produção
2. **`public/_redirects`** - Redirecionamentos do Netlify
3. **`netlify.toml`** - Configuração do Netlify

## 🔧 CONFIGURAÇÕES NO PAINEL DO NETLIFY

### 1. Variáveis de Ambiente (Environment Variables)

Acesse: **Site Settings > Environment Variables** e configure:

```
VITE_API_URL = https://controle-de-estoque-web-api.onrender.com
VITE_WS_URL = wss://controle-de-estoque-web-api.onrender.com
VITE_ENV = production
```

### 2. Limpar Cache e Redeployar

#### Opção A - Via Painel Netlify:
1. Vá em **Deploys**
2. Clique em **Trigger deploy**
3. Selecione **Clear cache and deploy site**

#### Opção B - Via Git:
1. Faça commit das alterações:
   ```bash
   git add .
   git commit -m "Configure Netlify to use Render API"
   git push
   ```

## 📁 ARQUIVOS MODIFICADOS

### `.env.production`
```
VITE_API_URL=https://controle-de-estoque-web-api.onrender.com
VITE_WS_URL=wss://controle-de-estoque-web-api.onrender.com
VITE_ENV=production
```

### `public/_redirects`
```
/api/*  https://controle-de-estoque-web-api.onrender.com/:splat  200
/auth/* https://controle-de-estoque-web-api.onrender.com/:splat  200
/*      /index.html   200
```

### `netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "https://controle-de-estoque-web-api.onrender.com/api/:splat"
  status = 200
  force = true
```

## 🚨 IMPORTANTE

- **Remover qualquer referência a `redblackspy.ddns.net` das variáveis de ambiente do Netlify**
- **Sempre usar "Clear cache and deploy" quando mudar variáveis de ambiente**
- **Verificar se o deploy foi feito com as novas configurações**

## ✅ VERIFICAÇÃO

Após o deploy, verificar no console do browser se:
1. `VITE_API_URL` aponta para `https://controle-de-estoque-web-api.onrender.com`
2. Não há referências a `localhost` ou `redblackspy.ddns.net`
3. As requisições estão sendo feitas para a API do Render
