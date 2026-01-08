'use client';

import { useState, useTransition } from 'react';
import { confirmPresence } from '@/lib/services/confirmPresence';
import { cancelPresence } from '@/lib/services/cancelPresence';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  matchId: string;
  initialConfirmed: boolean;
  date: string;
  time: string;
}

export default function ConfirmClient({
  matchId,
  initialConfirmed,
  date,
  time,
}: Props) {
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const res = await confirmPresence(matchId);
      if (res.error) {
        if (res.error === 'MATCH_NOT_FOUND') {
          toast.warning('Partida não encontrada!');
          router.push('/');
        } else if (res.error === 'MATCH_CLOSED') {
          toast.warning('Partida encerrada!');
          router.push('/');
        } else if (res.error === 'CONFIRMATION_LIMIT_REACHED') {
          toast.warning('O limite de 16 jogadores já foi atingido.');
        } else {
          toast.warning('Erro ao completar ação.');
        }
      } else if (res?.success) {
        setConfirmed(true);
        toast.success('Presença confirmada ⚽');
      }
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const res = await cancelPresence(matchId);

      if (res.error) {
        if (res.error === 'MATCH_NOT_FOUND') {
          toast.warning('Partida não encontrada!');
          router.push('/');
        } else if (res.error === 'MATCH_CLOSED') {
          toast.warning('Partida encerrada!');
          router.push('/');
        } else {
          toast.warning('Erro ao completar ação.');
          router.push('/');
        }
      } else if (res?.success) {
        toast.success('Presença cancelada');
        setConfirmed(false);
      } else {
        toast.warning('Erro ao completar ação.');
      }
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold">Confirmação de presença</h1>
        <p className="text-sm text-muted-foreground">
          {date} • {time}
        </p>

        {confirmed ? (
          <>
            <p className="text-muted-foreground">
              Você está confirmado nessa partida.
            </p>

            <Button
              variant="destructive"
              className="w-full"
              disabled={isPending}
              onClick={handleCancel}
            >
              {isPending ? 'Cancelando...' : 'Cancelar presença'}
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">
              Você ainda não confirmou presença.
            </p>

            <Button
              className="w-full"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? 'Confirmando...' : 'Confirmar presença'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
