export async function subscribePush() {
  if (typeof window === 'undefined') return;

  if (!('Notification' in window)) {
    return 'unsupported';
  }

  // Se já está permitido
  if (Notification.permission === 'granted') {
    await doSubscribe();
    return 'granted';
  }

  // Pede permissão
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    return permission; // "denied"
  }

  await doSubscribe();
  return 'granted';
}

async function doSubscribe() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });
}
