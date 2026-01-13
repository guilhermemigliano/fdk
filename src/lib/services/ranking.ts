import Match from '@/lib/models/Match';
import Player from '@/lib/models/Player';
import { connectDB } from '@/lib/db';

export async function getRankingGeralGols() {
  await connectDB();

  const matches = await Match.find({}).lean();

  const totalPartidas = matches.length;

  const stats: Record<string, { gols: number; jogos: number }> = {};

  // PROCESSA TODAS AS PARTIDAS
  matches.forEach((match) => {
    match.playersTeam1.forEach((p: any) => {
      if (!stats[p.player]) stats[p.player] = { gols: 0, jogos: 0 };

      stats[p.player].gols += p.gol || 0;
      stats[p.player].jogos += 1;
    });

    match.playersTeam2.forEach((p: any) => {
      if (!stats[p.player]) stats[p.player] = { gols: 0, jogos: 0 };

      stats[p.player].gols += p.gol || 0;
      stats[p.player].jogos += 1;
    });
  });

  const playerIds = Object.keys(stats);

  const players = await Player.find({
    _id: { $in: playerIds },
  })
    .select('nome sobrenome fotoBase64')
    .lean();

  const ranking = players
    .map((player) => ({
      ...player,
      totalGols: stats[player._id.toString()].gols,
      totalJogos: stats[player._id.toString()].jogos,
    }))
    .sort((a, b) => b.totalGols - a.totalGols);

  return {
    ranking,
    totalPartidas,
  };
}
