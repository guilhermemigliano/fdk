export async function subscribePush() {
  if (typeof window === 'undefined') return;

  console.log('entrou aqui 1');

  if (!('Notification' in window)) {
    console.log('entrou aqui 2');
    return 'unsupported';
  }

  // Se já está permitido
  if (Notification.permission === 'granted') {
    console.log('entrou aqui 3');
    await doSubscribe();
    return 'granted';
  }

  // Pede permissão
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.log('entrou aqui 4');
    return permission; // "denied"
  }

  await doSubscribe();
  return 'granted';
}

async function doSubscribe() {
  console.log('entrou aqui 5');
  const registration = await navigator.serviceWorker.ready;

  console.log('entrou aqui 6');
  console.log(registration);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  console.log('entrou aqui 7');
  console.log(subscription);

  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });

  return;
}
