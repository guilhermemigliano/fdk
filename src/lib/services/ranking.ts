import Match from '@/lib/models/Match';
//import Player from '@/lib/models/Player';
import { connectDB } from '@/lib/db';

export async function getRankingGeralGols() {
  await connectDB();

  const matches = await Match.find({ isClosed: true })
    .populate('playersTeam1.player', 'nome sobrenome fotoBase64')
    .populate('playersTeam2.player', 'nome sobrenome fotoBase64')
    .lean();

  if (!matches.length) {
    return { ranking: [], totalPartidas: 0 };
  }

  const stats: Record<string, any> = {};

  for (const match of matches) {
    const allPlayers = [...match.playersTeam1, ...match.playersTeam2];

    for (const p of allPlayers) {
      const pl = p.player;
      if (!pl) continue;

      if (!stats[pl._id]) {
        stats[pl._id] = {
          _id: pl._id,
          nome: pl.nome,
          sobrenome: pl.sobrenome,
          fotoBase64: pl.fotoBase64,
          totalGols: 0,
          totalJogos: 0,
        };
      }

      stats[pl._id].totalGols += p.gol || 0;
      stats[pl._id].totalJogos += 1;
    }
  }

  const ranking = Object.values(stats).sort(
    (a: any, b: any) => b.totalGols - a.totalGols,
  );

  return {
    ranking,
    totalPartidas: matches.length,
  };
}

export async function getRankingAnualGols(year: number) {
  await connectDB();

  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const matches = await Match.find({
    date: { $gte: start, $lt: end },
    isClosed: true,
  })
    .populate('playersTeam1.player', 'nome sobrenome fotoBase64')
    .populate('playersTeam2.player', 'nome sobrenome fotoBase64')
    .lean();

  if (!matches.length) {
    return { ranking: [], totalPartidas: 0 };
  }

  const stats: Record<string, any> = {};

  for (const match of matches) {
    const allPlayers = [...match.playersTeam1, ...match.playersTeam2];

    for (const p of allPlayers) {
      const pl = p.player;
      if (!pl) continue;

      if (!stats[pl._id]) {
        stats[pl._id] = {
          _id: pl._id,
          nome: pl.nome,
          sobrenome: pl.sobrenome,
          fotoBase64: pl.fotoBase64,
          totalGols: 0,
          totalJogos: 0,
        };
      }

      stats[pl._id].totalGols += p.gol || 0;
      stats[pl._id].totalJogos += 1;
    }
  }

  const ranking = Object.values(stats).sort(
    (a: any, b: any) => b.totalGols - a.totalGols,
  );

  return {
    ranking,
    totalPartidas: matches.length,
  };
}
