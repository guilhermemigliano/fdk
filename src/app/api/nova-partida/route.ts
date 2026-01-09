import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';

export async function GET() {
  await connectDB();

  const match = await Match.findOne({ isClosed: false })
    .populate({
      path: 'confirmation',
      select: 'nome sobrenome posicao fotoBase64',
    })
    .sort({ date: -1 })
    .lean();

  if (!match) {
    return NextResponse.json({ players: [] });
  }

  return NextResponse.json({ match });
}
