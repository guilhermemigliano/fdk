import Match from '@/lib/models/Match';
import Player from '@/lib/models/Player';
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

export async function getRankingAnualVitorias(year: number) {
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
    return {
      ranking: [],
      totalPartidas: 0,
    };
  }

  const stats: Record<string, any> = {};

  for (const match of matches) {
    const isTeam1Winner = match.team1Score > match.team2Score;
    const isTeam2Winner = match.team2Score > match.team1Score;
    const isDraw = match.team1Score === match.team2Score;

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
          totalVitorias: 0,
          totalEmpates: 0,
          totalDerrotas: 0,
          totalJogos: 0,
        };
      }

      const isFromTeam1 = match.playersTeam1.some(
        (x: any) => x.player._id.toString() === pl._id.toString(),
      );

      // Soma jogos
      stats[pl._id].totalJogos += 1;

      // Vitória
      if ((isTeam1Winner && isFromTeam1) || (isTeam2Winner && !isFromTeam1)) {
        stats[pl._id].totalVitorias += 1;
        continue;
      }

      // Derrota
      if ((isTeam1Winner && !isFromTeam1) || (isTeam2Winner && isFromTeam1)) {
        stats[pl._id].totalDerrotas += 1;
        continue;
      }

      // Empate
      if (isDraw) {
        stats[pl._id].totalEmpates += 1;
      }
    }
  }

  // 🔥 Critérios de ordenação
  const ranking = Object.values(stats).sort((a: any, b: any) => {
    if (b.totalVitorias !== a.totalVitorias) {
      return b.totalVitorias - a.totalVitorias; // mais vitórias
    }
    if (b.totalEmpates !== a.totalEmpates) {
      return b.totalEmpates - a.totalEmpates; // mais empates
    }
    return b.totalJogos - a.totalJogos; // desempate final
  });

  return { ranking, totalPartidas: matches.length };
}

export async function getRankingGeralVitorias() {
  // Buscar apenas partidas fechadas
  const matches = await Match.find({ isClosed: true }).lean();

  const stats: Record<
    string,
    {
      _id: string;
      nome: string;
      sobrenome: string;
      fotoBase64: string;
      totalJogos: number;
      vitorias: number;
      empates: number;
      derrotas: number;
    }
  > = {};

  for (const match of matches) {
    const t1 = match.team1Score;
    const t2 = match.team2Score;

    const team1Players = match.playersTeam1.map((p: any) =>
      p.player.toString(),
    );
    const team2Players = match.playersTeam2.map((p: any) =>
      p.player.toString(),
    );

    const allPlayersMatch = [...team1Players, ...team2Players];

    for (const playerId of allPlayersMatch) {
      if (!stats[playerId]) {
        const u = await Player.findById(playerId).lean();
        if (!u) continue;

        stats[playerId] = {
          _id: u._id.toString(),
          nome: u.nome,
          sobrenome: u.sobrenome,
          fotoBase64: u.fotoBase64,
          totalJogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
        };
      }

      const s = stats[playerId];

      s.totalJogos += 1;

      if (team1Players.includes(playerId) && t1 > t2) s.vitorias++;
      else if (team2Players.includes(playerId) && t2 > t1) s.vitorias++;
      else if (t1 === t2) s.empates++;
      else s.derrotas++;
    }
  }

  const ranking = Object.values(stats);

  // Ordenação:
  // 1º mais vitórias
  // 2º mais empates
  // 3º menos derrotas
  ranking.sort((a, b) => {
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.empates !== a.empates) return b.empates - a.empates;
    return a.derrotas - b.derrotas;
  });

  return {
    ranking,
    totalPartidas: matches.length,
  };
}
