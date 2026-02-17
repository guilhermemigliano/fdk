'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ResetarSenha() {
  const params = useSearchParams();
  const token = params.get('token');

  const [senha, setSenha] = useState('');

  async function handleReset() {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, novaSenha: senha }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success('Senha redefinida!');
      window.location.href = '/login';
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Nova senha</h1>

      <Input
        type="password"
        placeholder="Nova senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <Button onClick={handleReset}>Redefinir senha</Button>
    </div>
  );
}
