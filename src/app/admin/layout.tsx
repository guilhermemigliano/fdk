import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const payload = verifyJwt(token);

    // 🔒 BLOQUEIA SE NÃO FOR ADMIN
    if (payload.role !== 'admin') {
      redirect('/login');
    }
  } catch {
    redirect('/login');
  }

  return <>{children}</>;
}
