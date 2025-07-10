# 📱 Guia de Teste de Notificações Móveis

## 🔔 Botões de Teste no Cabeçalho

Adicionei **3 botões de teste** no cabeçalho da aplicação que funcionam tanto em desktop quanto em celular:

### 1. **🔔 Teste Geral**
- Testa notificação básica com deep linking
- Redireciona para a página de Pedidos
- Detecta automaticamente se é mobile ou desktop
- **Mobile**: Vibração `[200, 100, 200]`, auto-fechar em 8s
- **Desktop**: Sem vibração, fechar em 15s

### 2. **✅ Teste Pedido**
- Simula notificação de "Pedido Aprovado"
- Redireciona para `/pedidos?highlight=123`
- **Mobile**: Vibração mais longa `[200, 100, 200, 100, 200]`
- Testa o highlight de item específico

### 3. **📋 Teste Requisição**
- Simula notificação de "Nova Requisição"
- Redireciona para `/item-requests`
- **Mobile**: Vibração curta `[100, 50, 100]`
- Testa navegação para página de requisições

## 📋 Como Testar no Celular

### **Passo 1: Acesso**
1. Abra o site no celular: `https://localhost:2002/` ou seu domínio
2. Faça login no sistema
3. Vá para qualquer página (Dashboard, Pedidos, etc.)

### **Passo 2: Permitir Notificações**
1. Na primeira vez, o navegador vai solicitar permissão
2. **IMPORTANTE**: Clique em "Permitir" ou "Allow"
3. Se perdeu a permissão, clique em **🔔 Teste Geral** para solicitar novamente

### **Passo 3: Testar**
1. **Minimize o navegador** ou coloque em segundo plano
2. Clique em qualquer botão de teste no cabeçalho:
   - **🔔 Teste** - Notificação básica
   - **✅ Pedido** - Teste de pedido aprovado
   - **📋 Req.** - Teste de requisição
3. Aguarde a notificação aparecer na tela
4. **Clique na notificação** para testar o redirecionamento

### **Passo 4: Verificar Funcionalidades**
- ✅ **Vibração**: O celular deve vibrar quando receber a notificação
- ✅ **Som**: Deve tocar o som padrão de notificação
- ✅ **Ícone**: Deve mostrar o ícone do sistema
- ✅ **Deep Link**: Deve abrir a página correta ao clicar
- ✅ **Auto-fechar**: Deve fechar automaticamente após 8 segundos

## 🛠️ Funcionalidades Implementadas

### **Detecção Móvel Automática**
```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```

### **Configurações Específicas para Mobile**
- **Vibração personalizada** para cada tipo de notificação
- **Auto-fechamento mais rápido** (8s vs 15s desktop)
- **Sem requireInteraction** para melhor UX mobile
- **Interface responsiva** dos botões de teste

### **Deep Linking Funcional**
- `/pedidos` - Página geral de pedidos
- `/pedidos?highlight=123` - Destaca pedido específico
- `/item-requests` - Página de requisições
- Scroll automático para item destacado

## 📱 Compatibilidade Móvel

### **Android**
- ✅ **Chrome Mobile** - Funciona perfeitamente
- ✅ **Firefox Mobile** - Funciona perfeitamente
- ✅ **Samsung Internet** - Funciona perfeitamente
- ✅ **Vibração** - Suportada
- ✅ **Deep Linking** - Suportado

### **iOS (iPhone/iPad)**
- ⚠️ **Safari Mobile** - Limitações do iOS
- ✅ **Chrome iOS** - Funciona
- ❌ **Vibração** - Não suportada pelo iOS
- ✅ **Deep Linking** - Suportado

### **PWA (Progressive Web App)**
- ✅ **Quando instalado** como PWA, funciona como app nativo
- ✅ **Notificações persistentes**
- ✅ **Ícone na tela inicial**

## 🔧 Troubleshooting

### **Notificação não aparece**
1. Verifique se deu permissão no navegador
2. Certifique-se que o site está em HTTPS
3. Minimize o navegador antes de testar
4. Verifique se não está em "Modo Não Perturbar"

### **Não vibra no Android**
1. Verifique se a vibração está habilitada no celular
2. Confirme que o navegador tem permissão para vibrar
3. Teste com outros apps de notificação

### **Deep link não funciona**
1. Verifique se está logado no sistema
2. Confirme que o site está carregado completamente
3. Teste clicando nos links manualmente primeiro

### **Botões não aparecem**
1. Faça hard refresh (Ctrl+F5 ou Cmd+Shift+R)
2. Limpe o cache do navegador
3. Verifique se o build foi gerado corretamente

## 🎯 Resultados Esperados

Após seguir os passos, você deve conseguir:

1. **📱 Receber notificações** no celular mesmo com o app em background
2. **🔄 Ser redirecionado** para a página correta ao clicar
3. **📳 Sentir a vibração** (Android) quando receber notificação  
4. **🎯 Ver item destacado** quando usar highlight
5. **⏱️ Auto-fechamento** das notificações após tempo definido

**Agora você pode testar completamente as notificações móveis! 🚀**
