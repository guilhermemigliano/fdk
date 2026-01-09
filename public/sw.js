// self.addEventListener('push', function (event) {
//   const data = event.data?.json() ?? {};

//   self.registration.showNotification(data.title || 'Nova notificação', {
//     body: data.body,
//     icon: '/icons/icon-192.png',
//     badge: '/icons/icon-72.png',
//     data: data.url || '/',
//   });
// });

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data));
// });
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: {
      url: data.url,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
