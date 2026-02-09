'use client';

// import { toggleMensalista } from '@/lib/services/mensalistas';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function StepTeam1({ match, onChange }: any) {
  const recalculateScore = (updatedMatch: any) => {
    const team1Goals =
      updatedMatch.playersTeam1.reduce(
        (acc: number, p: any) => acc + p.gol,
        0,
      ) +
      updatedMatch.playersTeam2.reduce(
        (acc: number, p: any) => acc + p.golContra,
        0,
      );

    const team2Goals =
      updatedMatch.playersTeam2.reduce(
        (acc: number, p: any) => acc + p.gol,
        0,
      ) +
      updatedMatch.playersTeam1.reduce(
        (acc: number, p: any) => acc + p.golContra,
        0,
      );

    updatedMatch.team1Score = team1Goals;
    updatedMatch.team2Score = team2Goals;

    return updatedMatch;
  };

  const addPlayer = (player: any) => {
    const already = match.playersTeam1.some((pl: any) => pl.id === player.id);

    if (already) {
      toast.warning('Jogador já adicionado!');
      return;
    }

    const newMatch = {
      ...match,
      playersTeam1: [
        ...match.playersTeam1,
        { ...player, gol: 0, golContra: 0 },
      ],
    };

    //onChange(newMatch);
    onChange(recalculateScore(newMatch));
  };

  const removePlayer = (id: string) => {
    const newMatch = {
      ...match,
      playersTeam1: match.playersTeam1.filter((pl: any) => pl.id != id),
    };
    onChange(recalculateScore(newMatch));
    //onChange(newMatch);
  };

  const confirmationSorted = [...match.confirmation].sort((a: any, b: any) =>
    `${a.nome} ${a.sobrenome}`.localeCompare(
      `${b.nome} ${b.sobrenome}`,
      'pt-BR',
      { sensitivity: 'base' },
    ),
  );

  return (
    <div className="space-y-10">
      {/* 🔝 MENSALISTAS */}
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">
            Time 1 (
            {match.playersTeam1.length > 0 ? match.playersTeam1.length : ''})
          </h1>
        </div>

        <div className="flex gap-0 overflow-x-auto pb-2 mt-4">
          {match.playersTeam1.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhum jogador adicionado
            </p>
          )}

          {match.playersTeam1.map((player: any) => (
            <Button
              key={player.id}
              className="flex flex-col items-center gap-2 min-w-20 h-auto "
              variant={'ghost'}
              onClick={() => removePlayer(player.id)}
            >
              <Avatar className="h-14 w-14">
                <AvatarImage src={player.foto} />
                <AvatarFallback>{player.nome[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-center">{player.nome}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 🔽 TODOS OS JOGADORES */}
      <div>
        <h2 className="font-semibold mb-3">Jogadores</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {confirmationSorted.map((player: any) => {
            return (
              <Button
                key={player.id}
                className="flex items-center justify-between border rounded-lg p-3 h-auto "
                variant={'ghost'}
                onClick={() => addPlayer(player)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.foto} />
                    <AvatarFallback>{player.nome[0]}</AvatarFallback>
                  </Avatar>

                  <span className="text-sm">
                    {player.nome} {player.sobrenome}
                  </span>
                </div>
              </Button>
            );
          })}
          {/* {match.confirmation.map((player: any) => {
            return (
              <Button
                key={player.id}
                className="flex items-center justify-between border rounded-lg p-3 h-auto "
                variant={'ghost'}
                onClick={() => addPlayer(player)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.foto} />
                    <AvatarFallback>{player.nome[0]}</AvatarFallback>
                  </Avatar>

                  <span className="text-sm">
                    {player.nome} {player.sobrenome}
                  </span>
                </div>
              </Button>
            );
          })} */}
        </div>
      </div>
    </div>
  );
}
