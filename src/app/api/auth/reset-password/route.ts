import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token, novaSenha } = await req.json();

  await connectDB();

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await Player.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ error: 'Token inválido ou expirado.' });
  }

  user.senhaHash = await bcrypt.hash(novaSenha, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return NextResponse.json({ success: true });
}
