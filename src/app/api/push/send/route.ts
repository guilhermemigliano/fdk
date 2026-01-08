import { NextResponse } from 'next/server';
import webpush from 'web-push';
import Player from '@/lib/models/Player';
import { connectDB } from '@/lib/db';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: Request) {
  const { userId, title, body, url } = await req.json();

  await connectDB();

  const user = await Player.findById(userId).lean();
  if (!user?.pushSubscription) return NextResponse.json({ error: 'No sub' });

  await webpush.sendNotification(
    user.pushSubscription,
    JSON.stringify({ title, body, url }),
  );

  return NextResponse.json({ sent: true });
}
