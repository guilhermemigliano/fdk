'use client';

// import { toggleMensalista } from '@/lib/services/mensalistas';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function StepEditScore({ match, onChange }: any) {
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

  const updateGoal = (
    team: number,
    id: string,
    field: 'gol' | 'golContra',
    inc: number,
  ) => {
    const key = team === 1 ? 'playersTeam1' : 'playersTeam2';

    const updatedPlayers = match[key].map((p: any) => {
      if (p.id !== id) return p;

      const newValue = p[field] + inc;
      return {
        ...p,
        [field]: newValue < 0 ? 0 : newValue,
      };
    });

    const updatedMatch = {
      ...match,
      [key]: updatedPlayers,
    };

    onChange(recalculateScore(updatedMatch));
  };

  const toggleClosed = (checked: boolean) => {
    const updatedMatch = {
      ...match,
      isClosed: checked,
    };

    onChange(updatedMatch);
  };

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <h1 className="text-2xl font-bold">Resultado</h1>
        </div>
      </div>

      {/* 🔽 JOGADORES TIME 1 */}
      {/* 🔽 TIME 1 */}
      <div>
        <h2 className="font-semibold mb-3">Time 1</h2>

        {match.playersTeam1.length === 0 && (
          <div>
            <span>Nenhum jogador adicionado.</span>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {match.playersTeam1.map((player: any) => {
            return (
              <div
                key={player.id}
                className="border rounded-lg p-3 flex flex-col gap-2"
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

                {/* GOLS */}
                <div className="flex justify-between items-center">
                  <span>Gols:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateGoal(1, player.id, 'gol', -1)}
                    >
                      -
                    </Button>
                    <span>{player.gol}</span>
                    <Button
                      size="sm"
                      onClick={() => updateGoal(1, player.id, 'gol', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* GOL CONTRA */}
                <div className="flex justify-between items-center">
                  <span>Gol Contra:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateGoal(1, player.id, 'golContra', -1)}
                    >
                      -
                    </Button>
                    <span>{player.golContra}</span>
                    <Button
                      size="sm"
                      onClick={() => updateGoal(1, player.id, 'golContra', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔽 JOGADORES TIME 2 */}
      {/* 🔽 TIME 2 */}
      <div>
        <h2 className="font-semibold mb-3">Time 2</h2>

        {match.playersTeam2.length === 0 && (
          <div>
            <span>Nenhum jogador adicionado.</span>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {match.playersTeam2.map((player: any) => {
            return (
              <div
                key={player.id}
                className="border rounded-lg p-3 flex flex-col gap-2"
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

                {/* GOLS */}
                <div className="flex justify-between items-center">
                  <span>Gols:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateGoal(2, player.id, 'gol', -1)}
                    >
                      -
                    </Button>
                    <span>{player.gol}</span>
                    <Button
                      size="sm"
                      onClick={() => updateGoal(2, player.id, 'gol', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* GOL CONTRA */}
                <div className="flex justify-between items-center">
                  <span>Gol Contra:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateGoal(2, player.id, 'golContra', -1)}
                    >
                      -
                    </Button>
                    <span>{player.golContra}</span>
                    <Button
                      size="sm"
                      onClick={() => updateGoal(2, player.id, 'golContra', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
