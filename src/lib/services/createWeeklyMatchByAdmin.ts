'use server';

import { connectDB } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import Match from '@/lib/models/Match';
import { getNextThursday } from '@/lib/date';
import Player from '@/lib/models/Player';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { horario_partida } from '@/app/constants/match';

export async function createWeeklyMatchByAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Não autenticado');
  }

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    throw new Error('Token inválido');
  }

  if (payload.role !== 'admin') {
    throw new Error('Acesso negado');
  }

  await connectDB();

  const matchDate = getNextThursday();

  const startOfDay = new Date(matchDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(matchDate);
  endOfDay.setHours(23, 59, 59, 999);

  const exists = await Match.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (exists) {
    return { error: 'Partida da semana já existente' };
  }

  await Match.create({
    date: matchDate,
    matchId:
      String(matchDate.getDate()).padStart(2, '0') +
      String(matchDate.getMonth() + 1).padStart(2, '0') +
      String(matchDate.getFullYear()),
    isClosed: false,
    team1: 'Time 1',
    team2: 'Time 2',
    playersTeam1: [],
    playersTeam2: [],
    confirmation: [],
    confirmationPending: [],
    updatedBy: [],
  });

  // 🔥 Buscar todos admins
  const admins = await Player.find({ role: 'admin' }).select('_id');

  const matchDateFormat = format(
    new Date(matchDate),
    `EEEE, dd 'de' MMMM 'às' ${horario_partida}`,
    {
      locale: ptBR,
    },
  );

  // 🔥 Enviar push para todos admins
  for (const admin of admins) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
      method: 'POST',
      body: JSON.stringify({
        userId: admin._id.toString(),
        title: 'Novo partida criada!',
        body: `Data da partida: ${matchDateFormat}`,
        url: `/proxima-partida`,
      }),
    });
  }

  return { message: 'Partida criada com sucesso!' };
}
