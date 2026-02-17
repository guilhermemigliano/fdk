'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    startTransition(async () => {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Verifique seu e-mail com as instruções', {
          action: {
            label: 'Ir para login',
            onClick: () => router.push('/login'),
          },
        });
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      }
    });
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Recuperar senha</h1>

      <Input
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar link de recuperação'
        )}
      </Button>
    </div>
  );
}
