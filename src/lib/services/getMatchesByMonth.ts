import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';

export async function getMatchesByMonth(year: number, month: number) {
  await connectDB();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);

  return Match.find({
    date: { $gte: start, $lte: end },
  })
    .sort({ date: -1 })
    .lean();
}
