export const dynamic = 'force-dynamic';

import { getRankingAnualVitorias } from '@/lib/services/ranking';
import Image from 'next/image';

export default async function RankingAnualVitoriasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;

  const currentYear = new Date().getFullYear();

  const anoParam = Array.isArray(resolved?.ano)
    ? resolved.ano[0]
    : resolved.ano;

  const ano = Number(anoParam) || currentYear;

  const { ranking, totalPartidas } = await getRankingAnualVitorias(ano);

  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center">
          Ranking Anual de Vitórias – {ano}
        </h1>

        {/* Ano Selector */}
        <div className="flex justify-center gap-3">
          {[ano - 1, ano, ano + 1].map((y) => (
            <a
              key={y}
              href={`/ranking/ranking-anual-vitorias?ano=${y}`}
              className={`px-3 py-2 rounded-md border ${
                ano === y ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {y}
            </a>
          ))}
        </div>

        <p className="text-center text-muted-foreground">
          Total de partidas: <b>{totalPartidas}</b>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-12">
        {ranking.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhum dado disponível.
          </p>
        )}

        {ranking.map((player, index) => (
          <div
            key={player._id}
            className="flex items-center justify-between border p-4 rounded-xl"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={player.fotoBase64 || '/images/user-icon.png'}
                  alt={player.nome}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col flex-1 basis-0">
                <span className="block truncate whitespace-nowrap overflow-hidden text-ellipsis">
                  {index + 1}º — {player.nome} {player.sobrenome}
                </span>

                <span className="text-xs text-muted-foreground">
                  Jogos: {player.totalJogos} • Vitórias: {player.totalVitorias}{' '}
                  • Empates: {player.totalEmpates} • Derrotas:{' '}
                  {player.totalDerrotas}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold">{player.totalVitorias}</span>
              <p className="text-xs text-muted-foreground">vitórias</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
