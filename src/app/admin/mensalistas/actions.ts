'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Mensalista from '@/lib/models/Mensalista';
import Player from '@/lib/models/Player';
import { PLAYER_PUBLIC_FIELDS } from '@/lib/projections/player';

/** Garante que exista um documento */
async function getOrCreateMensalistaDoc() {
  let doc = await Mensalista.findOne();
  if (!doc) {
    doc = await Mensalista.create({ players: [] });
  }
  return doc;
}

export async function getMensalistas() {
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

  const doc = await getOrCreateMensalistaDoc();

  const mensalistas = await Player.find(
    { _id: { $in: doc.players } },
    PLAYER_PUBLIC_FIELDS,
  ).lean();

  const todosJogadores = await Player.find({}, PLAYER_PUBLIC_FIELDS).lean();

  return {
    mensalistas: mensalistas.map(mapPlayer),
    todosJogadores: todosJogadores.map(mapPlayer),
  };
}

export async function saveMensalistas(playerIds: string[]) {
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

  const doc = await getOrCreateMensalistaDoc();

  doc.players = playerIds;
  await doc.save();

  return { success: true };
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
