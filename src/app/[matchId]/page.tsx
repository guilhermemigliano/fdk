import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getMatchConfirmation } from '@/lib/services/getMatchConfirmation';
import ConfirmClient from './confirm-client';

interface Props {
  params: Promise<{ matchId: string }>;
}

export default async function ConfirmMatchPage({ params }: Props) {
  const { matchId } = await params;

  const user = await getAuthUser();
  if (!user) {
    redirect(`/login?redirect=/${matchId}`);
  }

  const data = await getMatchConfirmation(matchId);

  if (data.error === 'MATCH_NOT_FOUND') {
    return (
      <Message
        title="Partida não encontrada"
        description="Essa partida não existe."
      />
    );
  }

  if (data.match.isClosed) {
    return (
      <Message
        title="Partida encerrada"
        description="Essa partida já foi fechada e não aceita novas confirmações."
      />
    );
  }

  const matchDate = new Date(data.match.date);

  const formattedDate = matchDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <ConfirmClient
      matchId={matchId}
      initialConfirmed={data.isConfirmed}
      date={formattedDate}
      time={'21:30'}
    />
  );
}

function Message({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
