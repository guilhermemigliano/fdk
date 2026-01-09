'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { subscribePush } from '@/lib/push/subscribe';
import { toast } from 'sonner';
import { isIOS, isInStandaloneMode } from '@/lib/device';
import InstallIosPwaModal from './pwa-ios-modal';

export default function NotificationsButton() {
  const [loading, setLoading] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  async function handleClick() {
    // iOS precisa estar instalado como PWA
    if (isIOS() && !isInStandaloneMode()) {
      setShowIosModal(true);
      return;
    }

    setLoading(true);
    const res = await subscribePush();
    setLoading(false);

    if (res === 'granted') toast.success('Notificações ativadas!');
    else if (res === 'denied') toast.error('Você negou as notificações.');
    else if (res === 'unsupported')
      toast.warning('Navegador não suporta Web Push.');
  }

  return (
    <>
      <button
        className="p-2 rounded-full bg-gray-800 text-white flex items-center justify-center"
        onClick={handleClick}
        disabled={loading}
      >
        <Bell className="h-6 w-6" />
      </button>

      {showIosModal && (
        <InstallIosPwaModal onClose={() => setShowIosModal(false)} />
      )}
    </>
  );
}
