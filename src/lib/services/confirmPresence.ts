'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import { hasMatchExpired } from '@/lib/services/confirmCancelLimit';
import Match from '@/lib/models/Match';

export async function confirmPresence(matchId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { error: 'NOT_AUTHENTICATED' };
  }

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    return { error: 'INVALID_TOKEN' };
  }

  await connectDB();

  const match = await Match.findOne({ matchId });

  if (!match) {
    return { error: 'MATCH_NOT_FOUND' };
  }

  if (hasMatchExpired(match.date)) {
    return { error: 'MATCH_CLOSED' };
  }

  if (match.isClosed) {
    return { error: 'MATCH_CLOSED' };
  }

  if (match.confirmation.length >= 16) {
    return { error: 'CONFIRMATION_LIMIT_REACHED' };
  }

  const userId = payload.sub;

  const alreadyConfirmed = match.confirmation.some(
    (id: any) => id.toString() === userId,
  );

  if (alreadyConfirmed) {
    return { error: 'ALREADY_CONFIRMED' };
  }

  match.confirmation.push(userId);
  await match.save();

  return { success: true };
}
