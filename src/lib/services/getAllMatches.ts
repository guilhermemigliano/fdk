import Match from '@/lib/models/Match';

export async function getAllMatches() {
  const matches = await Match.find({}).sort({ date: -1 }).lean();

  return matches.map((m) => ({
    ...m,
    id: m._id.toString(),
    date: m.date,
  }));
}
