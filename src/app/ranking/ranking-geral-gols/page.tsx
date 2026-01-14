import { getRankingGeralGols } from '@/lib/services/ranking';
import Image from 'next/image';

export default async function RankingGeralGolsPage() {
  const { ranking, totalPartidas } = await getRankingGeralGols();

  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center">
          Ranking Geral de Gols
        </h1>

        <p className="text-center text-muted-foreground">
          Total de partidas registradas: <b>{totalPartidas}</b>
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
            className="flex items-center justify-start gap-4"
          >
            <div className="w-5 h-5 bg-black flex items-center justify-center text-center rounded-full">
              <span className="text-sm text-white">{index + 1}</span>
            </div>
            <div className="flex items-center justify-between border p-4 rounded-xl flex-1">
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10">
                  <Image
                    src={player.fotoBase64 || '/images/user-icon.png'}
                    alt={player.nome}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 basis-0">
                  <span
                    className="
        block
        truncate
        whitespace-nowrap
        overflow-hidden
        text-ellipsis
      "
                  >
                    {player.nome} {player.sobrenome}
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
          </div>
        ))}
      </div>
    </div>
  );
}
