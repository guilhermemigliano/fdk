import Link from 'next/link';
import { getMatchesByMonth } from '@/lib/services/getMatchesByMonth';

interface Props {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function PartidasPage({ searchParams }: Props) {
  const params = await searchParams;

  const now = new Date();
  const month = Number(params.month ?? now.getMonth());
  const year = Number(params.year ?? now.getFullYear());

  const matches = await getMatchesByMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/admin/partidas?month=${prevMonth}&year=${prevYear}`}>
          ← Anterior
        </Link>

        <h1 className="text-xl font-bold">
          {new Date(year, month).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </h1>

        <Link href={`/admin/partidas?month=${nextMonth}&year=${nextYear}`}>
          Próximo →
        </Link>
      </div>

      <div className="space-y-2">
        {matches.map((match: any) => (
          <Link
            key={match._id}
            href={`/admin/partidas/${match._id}`}
            className="block border rounded-lg p-4 hover:bg-muted"
          >
            <div className="flex justify-between">
              <span>{new Date(match.date).toLocaleDateString('pt-BR')}</span>
              <span className="font-semibold">
                {match.team1Score} x {match.team2Score}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
