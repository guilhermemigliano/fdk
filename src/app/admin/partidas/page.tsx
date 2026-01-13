import { getAllMatches } from '@/lib/services/getAllMatches';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AdminPartidasPage() {
  const partidas = await getAllMatches();

  if (!partidas.length) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Partidas</h1>
        <p className="text-muted-foreground">Nenhuma partida cadastrada.</p>
      </div>
    );
  }

  // Agrupamento por mês/ano
  const agrupado: Record<string, any[]> = {};

  partidas.forEach((p) => {
    const key = format(new Date(p.date), "MMMM 'de' yyyy", { locale: ptBR });
    if (!agrupado[key]) agrupado[key] = [];
    agrupado[key].push(p);
  });

  const meses = Object.keys(agrupado);

  function closedMatches() {
    return partidas.filter((p) => p.isClosed == true).length;
  }
  function openMatches() {
    return partidas.filter((p) => p.isClosed != true).length;
  }

  return (
    <div className="flex flex-col h-svh overflow-hidden p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Partidas</h1>
      <div className="flex gap-4 items-center justify-center">
        <div className="bg-green-600 w-1 h-1 rounded-full"></div>
        <span className="text-sm">Aberta ({openMatches()})</span>
        <div className="bg-red-500 w-1 h-1 rounded-full"></div>
        <span className="text-sm">Fechada ({closedMatches()})</span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-12">
        {meses.map((mes) => (
          <div
            key={mes}
            className="flex flex-col items-center justify-center gap-2 w-full max-w-3xl"
          >
            {/* Cabeçalho do mês */}
            <h2 className="text-xl font-bold p-2">{mes}</h2>
            <div className="space-y-4 w-full">
              {agrupado[mes].map((match) => (
                <Link
                  key={match.id}
                  href={`/admin/partidas/${match.id}`}
                  className={`flex justify-between w-full items-center border rounded-lg p-4 hover:bg-muted transition ${
                    match.isClosed
                      ? 'border-l-red-500 border-2'
                      : 'border-l-green-600 border-2'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {format(new Date(match.date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {match.team1Score} x {match.team2Score}
                  </span>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white w-20 text-center ${
                      match.isClosed ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  >
                    {match.isClosed ? 'Fechada' : 'Aberta'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
