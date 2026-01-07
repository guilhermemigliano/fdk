'use client';

// import { toggleMensalista } from '@/lib/services/mensalistas';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useTransition } from 'react';
import { saveMensalistas } from './actions';
import { toast } from 'sonner';

type Player = {
  id: string;
  nome: string;
  sobrenome: string;
  fullName: string;
  posicao: string;
  foto?: string;
};

interface Props {
  mensalistas: Player[];
  jogadores: Player[];
}

export default function MensalistasClient({ mensalistas, jogadores }: Props) {
  const [mensalistasArray, setMensalistasArray] =
    useState<Player[]>(mensalistas);
  const [isPending, startTransition] = useTransition();

  function handleMensalista(player: Player) {
    if (mensalistasArray.find((pl) => player.id == pl.id)) {
      alert('Jogador já adicionado');
    } else {
      setMensalistasArray((prev) => [...prev, player]);
    }
  }

  function handleRemoveMensalista(player: Player) {
    const mensalistas = mensalistasArray.filter((pl) => pl.id != player.id);
    setMensalistasArray(mensalistas);
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const ids = mensalistasArray.map((p) => p.id);

        await saveMensalistas(ids);
        toast.success('Mensalistas salvos');
      } catch (err: any) {
        toast.warning(err?.message || 'Você não tem permissão para isso.');
      }
    });
  }

  return (
    <div className="space-y-10">
      {/* 🔝 MENSALISTAS */}
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">
            Mensalistas (
            {mensalistasArray.length > 0 ? mensalistasArray.length : ''})
          </h1>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        <div className="flex gap-0 overflow-x-auto pb-2 mt-4">
          {mensalistasArray.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhum mensalista cadastrado
            </p>
          )}

          {mensalistasArray.map((player) => (
            <Button
              key={player.id}
              className="flex flex-col items-center gap-2 min-w-20 h-auto "
              variant={'ghost'}
              onClick={() => handleRemoveMensalista(player)}
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
          {jogadores.map((player) => {
            return (
              <Button
                key={player.id}
                className="flex items-center justify-between border rounded-lg p-3 h-auto "
                variant={'ghost'}
                onClick={() => handleMensalista(player)}
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
        </div>
      </div>
    </div>
  );
}
