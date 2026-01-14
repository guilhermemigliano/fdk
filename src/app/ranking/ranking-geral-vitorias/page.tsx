export const dynamic = 'force-dynamic';

import { getRankingGeralVitorias } from '@/lib/services/ranking';
import Image from 'next/image';

export default async function RankingGeralVitoriasPage() {
  const { ranking, totalPartidas } = await getRankingGeralVitorias();

  return (
    <div className="flex flex-col h-svh overflow-hidden">
      {/* Cabeçalho fixo */}
      <div className="p-6 pb-3 border-b bg-background">
        <h1 className="text-3xl font-bold text-center">
          Ranking Geral de Vitórias
        </h1>

        <p className="text-center text-muted-foreground mt-3">
          Total de partidas registradas: <b>{totalPartidas}</b>
        </p>
      </div>

      {/* Lista rolável */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-12">
        {ranking.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum dado disponível.
          </p>
        ) : (
          ranking.map((player, index) => (
            <div
              key={player._id}
              className="flex items-center justify-start gap-4"
            >
              <div className="w-5 h-5 bg-black flex items-center justify-center text-center rounded-full">
                <span className="text-sm text-white">{index + 1}</span>
              </div>
              <div className="flex items-center justify-between border p-4 rounded-xl flex-1">
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
                      {player.nome} {player.sobrenome}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Jogos: {player.totalJogos} • Empates: {player.empates} •
                      Derrotas: {player.derrotas}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-bold">{player.vitorias}</span>
                  <p className="text-xs text-muted-foreground">vitórias</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
