'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import { hasMatchExpired } from '@/lib/services/confirmCancelLimit';
import Match from '@/lib/models/Match';
import Player from '@/lib/models/Player';
import { pusherServer } from '@/lib/pusher/server';

export async function cancelPresence(matchId: string, targetPlayerId?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { error: 'NOT_AUTHENTICATED' };

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    return { error: 'INVALID_TOKEN' };
  }

  await connectDB();

  const match = await Match.findOne({ matchId });

  if (!match) return { error: 'MATCH_NOT_FOUND' };

  if (hasMatchExpired(match.date)) {
    return { error: 'MATCH_CLOSED' };
  }

  if (match.isClosed) return { error: 'MATCH_CLOSED' };

  const userId = payload.sub;

  if (!(payload.role === 'admin' && targetPlayerId)) {
    if (match.isClosed) return { error: 'Você não tem permissão' };
  }

  // Se admin e fornecido um target, cancela outro jogador
  const playerToRemove =
    payload.role === 'admin' && targetPlayerId ? targetPlayerId : userId;

  match.confirmation = match.confirmation.filter(
    (id: any) => id.toString() !== playerToRemove,
  );
  match.playersTeam1 = match.playersTeam1.filter(
    (pl: any) => pl.player.toString() !== playerToRemove,
  );
  match.playersTeam2 = match.playersTeam2.filter(
    (pl: any) => pl.player.toString() !== playerToRemove,
  );

  const score = calculateScore(match);

  match.team1Score = score.team1Score;
  match.team2Score = score.team2Score;

  await match.save();

  const user = await Player.findById(userId).select('nome sobrenome');

  await pusherServer.trigger(`match-${matchId}`, 'canceled', {
    nome: user.nome,
    sobrenome: user.sobrenome,
  });

  // 🔥 Buscar todos admins
  const admins = await Player.find({ role: 'admin' }).select('_id');

  const msg =
    payload.role === 'admin' && targetPlayerId
      ? `${user.nome} ${user.sobrenome} foi removido da partida`
      : `${user.nome} ${user.sobrenome} cancelou presença.`;

  // 🔥 Enviar push para todos admins
  for (const admin of admins) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
      method: 'POST',
      body: JSON.stringify({
        userId: admin._id.toString(),
        title: 'Jogador cancelou presença!',
        body: msg,
        url: `/proxima-partida`,
      }),
    });
  }

  return { success: true };
}

const calculateScore = (updatedMatch: any) => {
  const team1Goals =
    updatedMatch.playersTeam1.reduce((acc: number, p: any) => acc + p.gol, 0) +
    updatedMatch.playersTeam2.reduce(
      (acc: number, p: any) => acc + p.golContra,
      0,
    );

  const team2Goals =
    updatedMatch.playersTeam2.reduce((acc: number, p: any) => acc + p.gol, 0) +
    updatedMatch.playersTeam1.reduce(
      (acc: number, p: any) => acc + p.golContra,
      0,
    );

  updatedMatch.team1Score = team1Goals;
  updatedMatch.team2Score = team2Goals;

  return updatedMatch;
};
