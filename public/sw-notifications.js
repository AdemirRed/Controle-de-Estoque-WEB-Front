// Service Worker para notificações em dispositivos móveis
const CACHE_NAME = 'controle-estoque-notifications-v1';

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Escutar cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada no Service Worker:', event);
  
  event.notification.close();
  
  // Obter dados da notificação
  const action = event.notification.data?.action || '/dashboard';
  const url = action.startsWith('/') ? `${self.location.origin}${action}` : action;
  
  console.log('Redirecionando para:', url);
  
  // Procurar janela existente ou abrir nova
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Verificar se já existe uma janela aberta com a origem
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin)) {
          console.log('Focando janela existente e navegando');
          client.focus();
          client.navigate(url);
          return;
        }
      }
      
      // Se não há janela aberta, abrir nova
      console.log('Abrindo nova janela');
      return self.clients.openWindow(url);
    })
  );
});

// Escutar ações de notificação (para Android)
self.addEventListener('notificationaction', (event) => {
  console.log('Ação de notificação:', event.action);
  
  if (event.action === 'open') {
    const action = event.notification.data?.action || '/dashboard';
    const url = action.startsWith('/') ? `${self.location.origin}${action}` : action;
    
    event.waitUntil(
      self.clients.openWindow(url)
    );
  }
  
  event.notification.close();
});

// Escutar mensagens do app principal
self.addEventListener('message', (event) => {
  console.log('Mensagem recebida no Service Worker:', event.data);
  
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, action } = event.data;
    
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: 'controle-estoque-sw',
      data: { action },
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: '📱 Abrir',
          icon: '/icon.png'
        }
      ]
    });
  }
});
