'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import { hasMatchExpired } from '@/lib/services/confirmCancelLimit';
import Match from '@/lib/models/Match';
import Player from '@/lib/models/Player';
import { pusherServer } from '@/lib/pusher/server';

export async function cancelPresence(matchId: string) {
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

  match.confirmation = match.confirmation.filter(
    (id: any) => id.toString() !== userId,
  );

  await match.save();

  const user = await Player.findById(userId).select('nome sobrenome');

  await pusherServer.trigger(`match-${matchId}`, 'canceled', {
    nome: user.nome,
    sobrenome: user.sobrenome,
  });

  // 🔥 Buscar todos admins
  const admins = await Player.find({ role: 'admin' }).select('_id');

  // 🔥 Enviar push para todos admins
  for (const admin of admins) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
      method: 'POST',
      body: JSON.stringify({
        userId: admin._id.toString(),
        title: 'Jogador cancelou presença!',
        body: `${user.nome} ${user.sobrenome} cancelou presença.`,
        url: `/partida/${matchId}/confirmados`,
      }),
    });
  }

  return { success: true };
}
