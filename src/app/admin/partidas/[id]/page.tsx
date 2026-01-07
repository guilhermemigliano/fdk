import Match from '@/lib/models/Match';
import { connectDB } from '@/lib/db';
import WizardClient from './wizard-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMatchPage({ params }: Props) {
  const { id } = await params;

  await connectDB();
  const match = await Match.findById(id).lean();

  return <WizardClient match={JSON.parse(JSON.stringify(match))} />;
}
