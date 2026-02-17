'use client';

import { useState } from 'react';
import { login } from './actions';
import { countries } from '@/lib/countries';

import { formatPhone } from '@/lib/phone';
import { motion } from 'framer-motion';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';

import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const [country, setCountry] = useState('BR');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCountry = countries.find((c) => c.code === country)!;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('country', country);

    const res = await login(formData);

    setLoading(false);

    if (res?.error) {
      toast.warning(res.error);
      return;
    }

    if (res.success) {
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';

      window.location.href = redirectTo;
    }

    toast.success('Bem-vindo!');
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      {/* ANIMAÇÃO */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* hidden country */}
              <input type="hidden" name="country" value={country} />

              {/* PAÍS */}
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label} ({c.dial})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* WHATSAPP COM INPUT MASK */}
              <Input
                name="whatsapp"
                placeholder={selectedCountry.mask}
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(formatPhone(e.target.value, country))
                }
                disabled={loading}
              />

              {/* SENHA */}
              <Input name="senha" type="password" placeholder="Senha" />

              <div className="flex justify-end">
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} • Futebol Manager
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
