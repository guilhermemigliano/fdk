import { initServiceWorker } from './init-sw';

export async function subscribePush() {
  console.log('Inicializando SW...');
  const registration = await initServiceWorker();

  if (!registration) {
    console.error('SW não inicializado');
    return 'sw-failed';
  }

  console.log('SW inicializado, pedindo permissão...');

  if (typeof window === 'undefined') return;

  if (!('Notification' in window)) {
    return 'unsupported';
  }

  // Se já está permitido
  if (Notification.permission === 'granted') {
    await doSubscribe(registration);
    return 'granted';
  }

  // Pede permissão
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    return permission; // "denied"
  }

  await doSubscribe(registration);
  return 'granted';
}

async function doSubscribe(registration: ServiceWorkerRegistration) {
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });

  return;
}
