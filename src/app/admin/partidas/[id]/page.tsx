//import Match from '@/lib/models/Match';
//import { connectDB } from '@/lib/db';
import WizardClient from './wizard-client';
//import Player from '@/lib/models/Player';
//import { PLAYER_PUBLIC_FIELDS } from '@/lib/projections/player';
import { getMatchAndPlayers } from './actions';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMatchPage({ params }: Props) {
  const { id } = await params;

  //await connectDB();
  //const match = await Match.findById(id).lean();

  const { match, todosJogadores } = await getMatchAndPlayers(id);

  if (!match) {
    return <div>Nenhuma partida encontrada.</div>;
  }

  return (
    <WizardClient
      match={JSON.parse(JSON.stringify(match))}
      todosJogadores={JSON.parse(JSON.stringify(todosJogadores))}
    />
  );
}
