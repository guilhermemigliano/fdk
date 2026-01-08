import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';
import Player from '@/lib/models/Player';

import ConfirmadosClient from './confirmados-client';

interface Props {
  params: Promise<{ matchId: string }>;
}

export default async function ConfirmadosPage({ params }: Props) {
  const { matchId } = await params;

  await connectDB();

  // Buscar partida por matchId (não pelo _id)
  const match = await Match.findOne({ matchId }).lean();

  if (!match) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Partida não encontrada</h1>
        <p className="text-muted-foreground mt-2">
          Verifique se o link está correto.
        </p>
      </div>
    );
  }

  // Buscar jogadores confirmados
  const confirmedPlayers = await Player.find({
    _id: { $in: match.confirmation },
  })
    .select('nome sobrenome fotoBase64 posicao')
    .lean();

  return (
    <ConfirmadosClient
      matchId={matchId}
      confirmedPlayers={JSON.parse(JSON.stringify(confirmedPlayers))}
      date={match.date}
    />
  );
}
