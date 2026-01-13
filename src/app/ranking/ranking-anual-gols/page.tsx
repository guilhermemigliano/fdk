export const dynamic = 'force-dynamic';

import { getRankingAnualGols } from '@/lib/services/ranking';
import Image from 'next/image';
import Link from 'next/link';

export default async function RankingAnualGolsPage({
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

  const { ranking, totalPartidas } = await getRankingAnualGols(ano);
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Ranking Anual de Gols – {ano}
      </h1>

      {/* Seletor de ano */}
      <div className="flex justify-center items-center gap-4">
        <a
          href={`/ranking/ranking-anual-gols?ano=${ano - 1}`}
          className="p-2 rounded-md border bg-white hover:bg-gray-100"
        >
          ←
        </a>

        <span className="font-bold text-xl">{ano}</span>

        <a
          href={`/ranking/ranking-anual-gols?ano=${ano + 1}`}
          className="p-2 rounded-md border bg-white hover:bg-gray-100"
        >
          →
        </a>
      </div>

      <p className="text-center text-muted-foreground">
        Total de partidas no ano: <b>{totalPartidas}</b>
      </p>

      <div className="space-y-4">
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
                  Jogos: {player.totalJogos}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold">{player.totalGols}</span>
              <p className="text-xs text-muted-foreground">gols</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
