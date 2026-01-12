'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import Match from '@/lib/models/Match';
import { PLAYER_PUBLIC_FIELDS } from '@/lib/projections/player';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { pusherServer } from '@/lib/pusher/server';

export async function getMatchAndPlayers(id: string) {
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

  const match = await Match.findById(id)
    .populate({
      path: 'confirmation',
      select: 'nome sobrenome posicao fotoBase64',
    })
    .populate({
      path: 'playersTeam1.player',
      select: 'nome sobrenome posicao fotoBase64',
    })
    .populate({
      path: 'playersTeam2.player',
      select: 'nome sobrenome posicao fotoBase64',
    })
    .lean();

  if (!match) {
    throw new Error('Partida não encontrada!');
  }

  const todosJogadores = await Player.find({}, PLAYER_PUBLIC_FIELDS)
    .sort({ nome: 1, sobrenome: 1 })
    .lean();

  match.confirmation = match.confirmation.map(mapPlayer);
  match.playersTeam1 = match.playersTeam1.map((pl: any) => {
    return {
      ...{
        id: pl.player._id.toString(),
        nome: pl.player.nome,
        sobrenome: pl.player.sobrenome,
        fullName: `${pl.player.nome} ${pl.player.sobrenome}`,
        posicao: pl.player.posicao,
        foto: pl.player.fotoBase64,
        gol: pl.gol,
        golContra: pl.golContra,
      },
    };
  });
  match.playersTeam2 = match.playersTeam2.map((pl: any) => {
    return {
      ...{
        id: pl.player._id.toString(),
        nome: pl.player.nome,
        sobrenome: pl.player.sobrenome,
        fullName: `${pl.player.nome} ${pl.player.sobrenome}`,
        posicao: pl.player.posicao,
        foto: pl.player.fotoBase64,
        gol: pl.gol,
        golContra: pl.golContra,
      },
    };
  });

  return {
    match: match,
    todosJogadores: todosJogadores.map(mapPlayer),
  };
}

/** 🔒 garante shape seguro */
function mapPlayer(player: any) {
  return {
    id: player._id.toString(),
    nome: player.nome,
    sobrenome: player.sobrenome,
    fullName: `${player.nome} ${player.sobrenome}`,
    posicao: player.posicao,
    foto: player.fotoBase64,
  };
}

export async function saveMatch(matchId: string, data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { error: 'NOT_AUTHENTICATED' };

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    return { error: 'INVALID_TOKEN' };
  }

  if (payload.role !== 'admin') {
    return { error: 'NOT_ADMIN' };
  }

  await connectDB();

  const match = await Match.findOne({ matchId });
  if (!match) return { error: 'MATCH_NOT_FOUND' };

  // ---------------------------------------
  // 🚨 VALIDAÇÕES IMPORTANTES
  // ---------------------------------------

  // if (data.playersTeam1.length === 0 || data.playersTeam2.length === 0) {
  //   return { error: 'Os dois times precisam ter jogadores.' };
  // }

  if (
    typeof data.team1Score !== 'number' ||
    typeof data.team2Score !== 'number'
  ) {
    return { error: 'Placar inválido.' };
  }

  // ---------------------------------------
  // 🗃 SALVAR OS DADOS NO BANCO
  // ---------------------------------------

  match.playersTeam1 = data.playersTeam1;
  match.playersTeam2 = data.playersTeam2;

  match.confirmation = data.confirmation;
  match.isClosed = data.isClosed === true;
  const score = calculateScore(match);
  match.team1Score = score.team1Score;
  match.team2Score = score.team2Score;

  // ----------------------------
  // 🔥 REGISTRO DE QUEM SALVOU
  // ----------------------------
  const adminId = payload.sub;
  match.updatedBy.push(adminId);

  await match.save();

  // 🔥 Buscar todos admins
  const admins = await Player.find({ role: 'admin' }).select('_id');

  const matchDateFormat = format(new Date(match.date), `dd/MM/yyyy`, {
    locale: ptBR,
  });

  await pusherServer.trigger(`newmatch`, 'newmatch', {});

  // 🔥 Enviar push para todos admins
  for (const admin of admins) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
      method: 'POST',
      body: JSON.stringify({
        userId: admin._id.toString(),
        title: 'Partida atualizada!',
        body: `Partida de ${matchDateFormat} foi atualizada.`,
        url: `/admin/partidas/${match._id}`,
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
