'use client';

import { useEffect, useState, useTransition } from 'react';
import { pusherClient } from '@/lib/pusher/client';
import { confirmPresence } from '@/lib/services/confirmPresence';
import { cancelPresence } from '@/lib/services/cancelPresence';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { horario_partida } from '@/app/constants/match';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
//import { useRouter } from 'next/navigation';

export default function ConfirmarClient({
  match,
  confirmed,
  userId,
  userRole,
}: any) {
  const [players, setPlayers] = useState(confirmed || []);
  const [isPending, startTransition] = useTransition();
  //const router = useRouter();

  const isConfirmed = players.some((p: any) => p._id === userId);

  async function reload() {
    const res = await fetch(`/api/partidas/${match.matchId}/confirmados`);
    const data = await res.json();
    setPlayers(data.players);
  }

  useEffect(() => {
    const channel = pusherClient.subscribe(`match-${match.matchId}`);

    channel.bind('confirmed', () => {
      reload();
    });

    channel.bind('canceled', () => {
      reload();
    });

    return () => {
      pusherClient.unsubscribe(`match-${match.matchId}`);
    };
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe(`newmatch`);

    channel.bind('newmatch', () => {
      console.log('teste');
      window.location.reload();
    });

    return () => {
      pusherClient.unsubscribe(`newmatch`);
    };
  }, []);

  if (!match) {
    return (
      <div className="p-6 text-center w-full">
        <h1 className="text-xl font-bold">Nenhuma partida disponível</h1>
        <p className="text-muted-foreground">
          A próxima partida ainda não foi criada.
        </p>
      </div>
    );
  }

  function handleConfirm() {
    startTransition(async () => {
      const res = await confirmPresence(match.matchId);
      if (res.error) {
        if (res.error === 'MATCH_NOT_FOUND') {
          toast.warning('Partida não encontrada!');
        } else if (res.error === 'MATCH_CLOSED') {
          toast.warning('Partida encerrada!');
        } else if (res.error === 'CONFIRMATION_LIMIT_REACHED') {
          toast.warning('O limite de 16 jogadores já foi atingido.');
        } else {
          toast.warning('Erro ao completar ação.');
        }
      } else {
        toast.success('Presença confirmada!');
      }
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const res = await cancelPresence(match.matchId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Presença cancelada.');
      }
    });
  }

  function handleCancelAdmin(targetPlayerId: string) {
    startTransition(async () => {
      const res = await cancelPresence(match.matchId, targetPlayerId);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Presença cancelada pelo administrador.');
      }
    });
  }

  return (
    <div className="w-full flex flex-1 items-center justify-start flex-col p-6 space-y-6 ">
      <h1 className="text-2xl font-bold text-center">Próxima Partida</h1>

      <p className="text-center text-muted-foreground">
        {format(
          new Date(match.date),
          `EEEE, dd 'de' MMMM 'às' ${horario_partida}`,
          {
            locale: ptBR,
          },
        )}
      </p>

      {/* botão confirm/cancel */}
      <div className="flex justify-center w-full">
        {isConfirmed ? (
          <Button
            onClick={handleCancel}
            disabled={isPending}
            variant={'destructive'}
          >
            {isPending ? 'Cancelando...' : 'Cancelar Presença'}
          </Button>
        ) : (
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Confirmando...' : 'Confirmar Presença'}
          </Button>
        )}
      </div>

      {/* Confirmados */}
      <div className="w-full py-4">
        <hr />
        <h2 className="text-lg font-semibold mb-3 text-center">Confirmados</h2>

        {players.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center">
            Nenhum jogador confirmado ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {players.map((player: any) => (
              <div
                key={player._id}
                className="flex items-center justify-between gap-3 border p-2 rounded-lg w-full"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={player.fotoBase64 || '/images/user-icon.png'}
                    width={40}
                    height={40}
                    className="rounded-lg"
                    alt="foto"
                  />
                  <span>
                    {player.nome} {player.sobrenome}
                  </span>
                </div>

                {/* 👇 Botão só aparece se for admin */}
                {userRole === 'admin' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelAdmin(player._id)}
                    disabled={isPending}
                  >
                    {isPending ? '...' : 'X'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
