import { getMensalistas } from '@/app/admin/mensalistas/actions';
import MensalistasClient from './mensalistas-client';

export default async function MensalistasPage() {
  const data = await getMensalistas();

  return (
    <div className="p-6 space-y-8">
      <MensalistasClient
        mensalistas={JSON.parse(JSON.stringify(data.mensalistas))}
        jogadores={JSON.parse(JSON.stringify(data.todosJogadores))}
      />
    </div>
  );
}
