import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';

export async function getLastClosedMatch() {
  await connectDB();

  const match = await Match.findOne({ isClosed: true })
    .sort({ date: -1 })
    .populate([
      { path: 'playersTeam1', select: 'nome sobrenome fotoBase64' },
      { path: 'playersTeam2', select: 'nome sobrenome fotoBase64' },
    ])
    .lean();

  return match;
}
