import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';
import ConfirmarClient from './proxima-client';

export default async function ProximaPartidaPage() {
  // verifica se o user está logado
  const user = await getAuthUser();
  if (!user) redirect('/login?redirect=/proxima-partida');

  await connectDB();

  // busca a próxima partida ainda aberta
  const match = await Match.findOne({ isClosed: false })
    .sort({ date: -1 })
    .lean();

  if (!match) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Nenhuma partida disponível</h1>
        <p className="text-muted-foreground">
          A próxima partida ainda não foi criada.
        </p>
      </div>
    );
  }

  // lista de confirmados
  const confirmedPlayers = await Match.findOne({ matchId: match.matchId })
    .populate({
      path: 'confirmation',
      select: 'nome sobrenome posicao fotoBase64',
    })
    .lean();

  return (
    <ConfirmarClient
      match={JSON.parse(JSON.stringify(match))}
      confirmed={JSON.parse(JSON.stringify(confirmedPlayers.confirmation))}
      userId={user._id.toString()}
    />
  );
}
