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

  return (
    <div className="p-6 space-y-10  flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-8">Partidas</h1>
      <div className="flex gap-4 items-center justify-center">
        <div className="bg-green-600 w-1 h-1 rounded-full"></div>
        <span className="text-sm">Aberta</span>
        <div className="bg-red-500 w-1 h-1 rounded-full"></div>
        <span className="text-sm">Fechada</span>
      </div>

      {meses.map((mes) => (
        <div
          key={mes}
          className="flex flex-col items-center justify-center gap-2"
        >
          {/* Cabeçalho do mês */}
          <h2 className="text-xl font-bold capitalize p-2">{mes}</h2>
          <div className="space-y-4">
            {agrupado[mes].map((match) => (
              <Link
                key={match.id}
                href={`/admin/partidas/${match.id}`}
                className="flex justify-between items-center border rounded-lg p-4 hover:bg-muted transition"
              >
                <div
                  className={`w-0.5 h-full {${
                    match.isClosed ? 'bg-red-500' : 'bg-green-500'
                  }`}
                ></div>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {format(new Date(match.date), 'dd/MM/yyyy')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {match.team1Score} x {match.team2Score}
                  </span>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 text-xs rounded-full text-white ${
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
  );
}

// import Link from 'next/link';
// import { getMatchesByMonth } from '@/lib/services/getMatchesByMonth';

// interface Props {
//   searchParams: Promise<{ month?: string; year?: string }>;
// }

// export default async function PartidasPage({ searchParams }: Props) {
//   const params = await searchParams;

//   const now = new Date();
//   const month = Number(params.month ?? now.getMonth());
//   const year = Number(params.year ?? now.getFullYear());

//   const matches = await getMatchesByMonth(year, month);

//   const prevMonth = month === 0 ? 11 : month - 1;
//   const prevYear = month === 0 ? year - 1 : year;

//   const nextMonth = month === 11 ? 0 : month + 1;
//   const nextYear = month === 11 ? year + 1 : year;

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <Link href={`/admin/partidas?month=${prevMonth}&year=${prevYear}`}>
//           ← Anterior
//         </Link>

//         <h1 className="text-xl font-bold">
//           {new Date(year, month).toLocaleDateString('pt-BR', {
//             month: 'long',
//             year: 'numeric',
//           })}
//         </h1>

//         <Link href={`/admin/partidas?month=${nextMonth}&year=${nextYear}`}>
//           Próximo →
//         </Link>
//       </div>

//       <div className="space-y-2">
//         {matches.map((match: any) => (
//           <Link
//             key={match._id}
//             href={`/admin/partidas/${match._id}`}
//             className="block border rounded-lg p-4 hover:bg-muted"
//           >
//             <div className="flex justify-between">
//               <span>{new Date(match.date).toLocaleDateString('pt-BR')}</span>
//               <span className="font-semibold">
//                 {match.team1Score} x {match.team2Score}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
