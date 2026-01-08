import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import Player from '@/lib/models/Player';

export async function POST(req: Request) {
  await connectDB();

  const subscription = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Não autenticado');
  }

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    throw new Error('Token inválido');
  }

  const userId = payload.sub;

  await Player.findByIdAndUpdate(userId, {
    $set: { pushSubscription: subscription },
  });

  return NextResponse.json({ ok: true });
}
