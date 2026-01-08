'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subscribePush } from '@/lib/push/subscribe';
import { toast } from 'sonner';

export function NotifyButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const result = await subscribePush();

      if (result === 'granted') {
        toast.success('Notificações ativadas!');
      } else if (result === 'denied') {
        toast.error('Você negou as notificações.');
      } else {
        toast.warning('Não foi possível ativar as notificações.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao ativar notificações.');
    }

    setLoading(false);
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="gap-2"
      variant="outline"
      size="icon"
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-muted-foreground border-t-transparent rounded-full" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
    </Button>
  );
}
