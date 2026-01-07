'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';

export async function cancelPresence(matchId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { error: 'NOT_AUTHENTICATED' };

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    return { error: 'INVALID_TOKEN' };
  }

  await connectDB();

  const match = await Match.findOne({ matchId });
  if (!match) return { error: 'MATCH_NOT_FOUND' };

  if (match.isClosed) return { error: 'MATCH_CLOSED' };

  const userId = payload.sub;

  match.confirmation = match.confirmation.filter(
    (id: any) => id.toString() !== userId,
  );

  await match.save();

  return { success: true };
}
