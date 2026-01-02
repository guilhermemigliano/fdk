import { cookies } from 'next/headers';
import { verifyJwt } from './jwt';
import Player from './models/Player';
import { connectDB } from './db';

export async function getAuthUser() {
  // ✅ forma correta no Next 16
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const payload = verifyJwt(token);

    await connectDB();

    return await Player.findById(payload.sub).select('-senhaHash');
  } catch {
    return null;
  }
}
