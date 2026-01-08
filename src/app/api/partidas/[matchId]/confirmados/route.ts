import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';
import Player from '@/lib/models/Player';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const { matchId } = await params;

  await connectDB();

  const match = await Match.findOne({ matchId }).lean();
  if (!match) {
    return NextResponse.json({ players: [] });
  }

  const players = await Player.find({
    _id: { $in: match.confirmation },
  })
    .select('nome sobrenome fotoBase64 posicao')
    .lean();

  return NextResponse.json({ players });
}
