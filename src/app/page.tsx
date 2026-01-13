import { getLastClosedMatch } from '@/lib/services/getLastClosedMatch';

interface ListPlayerProps {
  player?: { nome: string; sobrenome: string };
  gol: number;
  golContra: number;
}

export const ListPlayers = async ({
  player,
  gol,
  golContra,
}: ListPlayerProps) => {
  return (
    <div className="p-2">
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-bold text-white flex-1">
          {player?.nome + ' ' + player?.sobrenome}
        </span>
        <span className="text-emerald-300">({gol})</span>
        <span className="text-red-500">({golContra})</span>
      </div>
    </div>
  );
};

export const MatchItem = async ({ match }: any) => {
  const {
    date,
    team1Score,
    team2Score,
    team1,
    team2,
    playersTeam1,
    playersTeam2,
  } = match;

  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(date));

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row p-4 justify-between gap-4 bg-zinc-100/10 rounded-4xl w-full">
        <div className="w-20 h-20 rounded-full  flex items-center justify-center text-white">
          {team1}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-8">
            <span className="text-4xl font-bold text-black">{team1Score}</span>
            <span className="text-4xl font-bold text-black">x</span>
            <span className="text-4xl font-bold text-black">{team2Score}</span>
          </div>
          <span className="text-sm text-black font-bold">{formattedDate}</span>
        </div>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white">
          {team2}
        </div>
      </div>
      <div className="bg-emerald-700/20 rounded-xl columns-2 w-[85%] mt-2">
        {/* TEAM 1 */}
        <div>
          {playersTeam1.map((pl: any) => {
            return (
              <ListPlayers
                key={pl.player._id}
                player={pl.player}
                gol={pl.gol}
                golContra={pl.golContra}
              />
            );
          })}
        </div>
        {/* TEAM 2 */}
        <div>
          {playersTeam2.map((pl: any) => {
            return (
              <ListPlayers
                key={pl.player._id}
                player={pl.player}
                gol={pl.gol}
                golContra={pl.golContra}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default async function HomePage() {
  const partida = await getLastClosedMatch();

  const match = JSON.parse(JSON.stringify(partida));

  if (!match) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Nenhuma partida encerrada ainda.
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full flex-col bg-[url('/images/background.png')] bg-cover">
      <main className="p-4">
        <div className="mt-2 flex flex-col items-center w-full">
          <span className="font-bold text-black">Última partida</span>
          <MatchItem match={match} />
        </div>
      </main>
    </div>
  );
}
