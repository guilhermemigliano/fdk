'use server';

import { connectDB } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import Match from '@/lib/models/Match';
import { getNextThursday } from '@/lib/date';

export async function createWeeklyMatch() {
  await connectDB();

  const matchDate = getNextThursday();

  // Evita criar duas partidas para a mesma data
  const exists = await Match.findOne({
    date: {
      $gte: new Date(matchDate.setHours(0, 0, 0, 0)),
      $lte: new Date(matchDate.setHours(23, 59, 59, 999)),
    },
  });

  if (exists) {
    console.log('Partida da semana já existe');
    return;
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
}

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

  // Evita criar duas partidas para a mesma data
  const exists = await Match.findOne({
    date: {
      $gte: new Date(matchDate.setHours(0, 0, 0, 0)),
      $lte: new Date(matchDate.setHours(23, 59, 59, 999)),
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

  return { message: 'Partida criada com sucesso!' };
}
