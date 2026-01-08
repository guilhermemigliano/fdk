export async function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    return registration;
  } catch (err) {
    console.error('Erro ao registrar SW:', err);
    return null;
  }
}
