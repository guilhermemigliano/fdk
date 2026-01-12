'use client';

import { useState, useTransition } from 'react';

import ConfirmadosStep from './step-confirmados';
import StepTeam1 from './step-team1';
import { Button } from '@/components/ui/button';
import StepTeam2 from './step-team2';
import { useRouter } from 'next/navigation';
import StepEditScore from './step-editScore';
import { saveMatch } from './actions';
import { toast } from 'sonner';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function WizardClient({ match, todosJogadores }: any) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(JSON.parse(JSON.stringify(match)));
  const [allPlayers, setAllPlayers] = useState(
    JSON.parse(JSON.stringify(todosJogadores)),
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSave() {
    startTransition(async () => {
      const newData = JSON.parse(JSON.stringify(data));
      newData.confirmation = data.confirmation.map((pl: any) => pl.id);
      newData.playersTeam1 = data.playersTeam1.map((pl: any) => {
        return { player: pl.id, gol: pl.gol, golContra: pl.golContra };
      });
      newData.playersTeam2 = data.playersTeam2.map((pl: any) => {
        return { player: pl.id, gol: pl.gol, golContra: pl.golContra };
      });

      const res = await saveMatch(match.matchId, newData);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success('Partida salva com sucesso!');
      router.push('/admin/partidas');
    });
  }

  const matchDateFormat = format(new Date(match.date), `dd/MM/yyyy`, {
    locale: ptBR,
  });

  const toggleClosed = (checked: boolean) => {
    const updatedMatch = {
      ...data,
      isClosed: checked,
    };

    setData(updatedMatch);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        {step == 1 && (
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        )}

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">
            Time 1 - {data.team1Score} x {data.team2Score} - Time 2
          </h1>
          <p>Partida: {matchDateFormat}</p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="destructive"
              onClick={() => toggleClosed(false)}
              className={cn(
                'px-2 py-2 bg-blue-500 text-blue-500',
                !data.isClosed
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-700'
                  : 'bg-white hover:bg-gray-100 text-black border',
              )}
            >
              Aberta
            </Button>

            {/* Botão FECHADA */}
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleClosed(true)}
              className={cn(
                'px-3 py-2 bg-blue-500',
                data.isClosed
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-700'
                  : 'bg-white hover:bg-gray-100 text-black border',
              )}
            >
              Fechada
            </Button>
          </div>
        </div>

        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)}>Avançar</Button>
        ) : (
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        )}
      </div>

      {step === 1 && (
        <ConfirmadosStep
          match={data}
          todosJogadores={allPlayers}
          onChange={setData}
        />
      )}
      {step === 2 && <StepTeam1 match={data} onChange={setData} />}
      {step === 3 && <StepTeam2 match={data} onChange={setData} />}
      {step === 4 && <StepEditScore match={data} onChange={setData} />}
    </div>
  );
}
