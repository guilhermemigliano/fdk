'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher/client';
import { horario_partida } from '@/app/constants/match';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { toast } from 'sonner';

export default function ConfirmadosClient({
  matchId,
  confirmedPlayers,
  date,
}: any) {
  const [players, setPlayers] = useState(confirmedPlayers);

  async function fetchConfirmados() {
    const res = await fetch(`/api/partidas/${matchId}/confirmados`);
    const data = await res.json();
    setPlayers(data.players);
  }

  useEffect(() => {
    const channel = pusherClient.subscribe(`match-${matchId}`);

    channel.bind('confirmed', (data: any) => {
      toast.success(`${data.nome} ${data.sobrenome} confirmou presença`);
      fetchConfirmados(); // atualiza a lista
    });

    channel.bind('canceled', (data: any) => {
      toast.warning(`${data.nome} ${data.sobrenome} cancelou a presença`);
      fetchConfirmados();
    });

    return () => {
      pusherClient.unsubscribe(`match-${matchId}`);
    };
  }, [matchId]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Jogadores Confirmados</h1>
        <p className="text-muted-foreground">
          {format(
            new Date(date),
            `EEEE, dd 'de' MMMM 'às' ${horario_partida}`,
            {
              locale: ptBR,
            },
          )}
        </p>
      </div>

      <div className="space-y-4">
        {players.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum jogador confirmou presença ainda.
          </p>
        ) : (
          players.map((player: any) => (
            <div
              key={player._id}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              <div className="relative h-12 w-12">
                <Image
                  src={player.fotoBase64 || '/images/user-icon.png'}
                  alt={player.nome}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover border"
                  unoptimized // necessário para base64
                />
              </div>

              <div>
                <p className="font-semibold">
                  {player.nome} {player.sobrenome}
                </p>
                <p className="text-sm text-muted-foreground">
                  {player.posicao}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
