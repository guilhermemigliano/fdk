import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';

export async function getLastClosedMatch() {
  await connectDB();

  const match = await Match.findOne({ isClosed: true })
    .sort({ date: -1 })
    .populate({
      path: 'playersTeam1.player',
      select: 'nome sobrenome',
    })
    .populate({
      path: 'playersTeam2.player',
      select: 'nome sobrenome',
    })
    .lean();

  return match;
}
