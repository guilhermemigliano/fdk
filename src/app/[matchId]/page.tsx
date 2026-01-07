import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { confirmPresence } from '@/lib/services/confirmPresence';

interface Props {
  params: Promise<{ matchId: string }>;
}

export default async function ConfirmMatchPage({ params }: Props) {
  const { matchId } = await params;

  // 🔐 verifica login
  const user = await getAuthUser();

  if (!user) {
    redirect(`/login?redirect=/${matchId}`);
  }

  const result = await confirmPresence(matchId);

  // ❌ match fechado
  if (result.error === 'MATCH_CLOSED') {
    return (
      <Message
        title="Partida encerrada"
        description="Essa partida já foi fechada e não aceita novas confirmações."
      />
    );
  }

  if (result.error === 'MATCH_NOT_FOUND') {
    return (
      <Message
        title="Partida não encontrada"
        description="A partida dessa semana ainda não foi criada."
      />
    );
  }

  // ❌ já confirmado
  if (result.error === 'ALREADY_CONFIRMED') {
    return (
      <Message
        title="Presença já confirmada"
        description="Você já confirmou presença nessa partida."
      />
    );
  }

  if (result.error === 'INVALID_MATCH_ID') {
    return (
      <Message
        title="Link inválido"
        description="O link da partida não é válido."
      />
    );
  }

  // ❌ erro genérico
  if (result.error) {
    return (
      <Message
        title="Erro"
        description="Não foi possível confirmar sua presença."
      />
    );
  }

  // ✅ sucesso
  return (
    <Message
      title="Presença confirmada ⚽"
      description="Sua presença foi registrada com sucesso!"
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
