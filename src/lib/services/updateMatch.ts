'use server';

import Match from '@/lib/models/Match';
import { connectDB } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export async function updateMatch(matchId: string, data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) throw new Error('Unauthorized');

  const payload = verifyJwt(token);
  if (payload.role !== 'admin') throw new Error('Forbidden');

  await connectDB();

  await Match.findByIdAndUpdate(matchId, data);

  return { success: true };
}
