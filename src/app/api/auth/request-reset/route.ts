import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import crypto from 'crypto';
import { sendResetEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  await connectDB();

  const user = await Player.findOne({ email });

  if (!user) {
    return NextResponse.json({
      success: true,
    }); // não revelar se existe ou não
  }

  const token = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/resetar-senha?token=${token}`;

  console.log(resetLink);

  await sendResetEmail(user.email, resetLink);

  return NextResponse.json({ success: true });
}
