'use server';

import { cookies } from 'next/headers';

export async function logout() {
  // ✅ Next.js 16: cookies() é assíncrono
  const cookieStore = await cookies();

  // remove o JWT
  cookieStore.delete('token');

  return { success: true };
}
