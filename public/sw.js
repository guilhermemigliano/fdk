self.addEventListener('push', function (event) {
  const data = event.data?.json() ?? {};

  self.registration.showNotification(data.title || 'Nova notificação', {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    data: data.url || '/',
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
