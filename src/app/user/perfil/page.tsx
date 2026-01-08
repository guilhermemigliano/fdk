import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';

export default async function UserProfilePage() {
  const user = await getAuthUser();

  if (!user) redirect('/login?redirect=/user/perfil');

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      <ProfileClient user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
