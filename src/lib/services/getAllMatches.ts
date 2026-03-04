import Match from '@/lib/models/Match';
import { connectDB } from '@/lib/db';

export async function getAllMatches() {
  await connectDB();

  const matches = await Match.find({}).sort({ date: -1 }).lean();

  return matches.map((m) => ({
    ...m,
    id: m._id.toString(),
    date: m.date,
  }));
}
