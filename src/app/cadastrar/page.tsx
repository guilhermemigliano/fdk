'use client';

import { useState } from 'react';
import { criarJogador } from './actions';
import { countries } from '@/lib/countries';
import { formatPhone } from '@/lib/phone';
import { compressImage } from './utils';
import Link from 'next/link';

import Image from 'next/image';

import { toast } from 'sonner';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';

import { useRouter } from 'next/navigation';

export default function NovoJogadorPage() {
  const [fotoBase64, setFotoBase64] = useState('');
  const [country, setCountry] = useState('BR');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const router = useRouter();

  const selectedCountry = countries.find((c) => c.code === country)!;

  const handleImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setFotoBase64(compressed);
  };

  function validateForm(form: HTMLFormElement) {
    if (!form.nome.value) return 'Preencha o nome';
    if (!form.sobrenome.value) return 'Preencha o sobrenome';
    if (!country) return 'Selecione um país';
    if (!form.whatsapp.value) return 'Adicione um WhatsApp válido';
    if (!form.posicao.value) return 'Selecione uma posição';
    if (!form.senha.value) return 'Preencha o campo senha';
    if (!fotoBase64) return 'Adicione uma foto';
    if (!form.acceptTerms.value) return 'Necessário aceitar os termos';

    return false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const hasError = validateForm(form);
    if (hasError) {
      toast.warning(hasError);
      return;
    }

    setIsSubmitting(true); // 🔒 bloqueia

    const formData = new FormData(form);
    formData.append('fotoBase64', fotoBase64);
    formData.append('country', country);

    const res = await criarJogador(formData);

    setIsSubmitting(false); // 🔓 libera

    if (res?.error) {
      toast.warning(res.error);

      return;
    }

    if (res?.success) {
      toast.success('Jogador cadastrado com sucesso!');

      form.reset(); // limpa inputs nativos
      setFotoBase64('');
      setWhatsapp('');
      setCountry('BR');
      router.push('/login');
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <Card className="shadow-md border rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Cadastrar Jogador
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center mb-8">
            {fotoBase64 && (
              <Image
                src={fotoBase64}
                alt="Preview"
                width={50}
                height={50}
                className="w-24 h-24 rounded-lg object-cover border mt-2"
              />
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID RESPONSIVO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="nome" placeholder="Nome" />
              <Input name="sobrenome" placeholder="Sobrenome" />

              {/* SELECT DE PAÍS */}
              <div className="sm:col-span-2 w-full">
                <input type="hidden" name="country" value={country} />

                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label} ({c.dial})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* WHATSAPP */}
              <div className="sm:col-span-2">
                <Input
                  name="whatsapp"
                  placeholder={selectedCountry.mask}
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(formatPhone(e.target.value, country))
                  }
                />
              </div>

              {/* POSIÇÃO */}
              <div className="sm:col-span-2">
                <Select name="posicao">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Goleiro">Goleiro</SelectItem>
                    <SelectItem value="Jogador">Jogador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SENHA */}
              <div className="sm:col-span-2">
                <Input type="password" name="senha" placeholder="Senha" />
              </div>
            </div>

            {/* FOTO */}
            <div className="space-y-2">
              <label className="block font-medium">Foto</label>
              <Input type="file" accept="image/*" onChange={handleImagem} />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(value) => setAcceptTerms(!!value)}
              />

              <label
                htmlFor="terms"
                className="text-sm leading-tight cursor-pointer"
              >
                Eu li e concordo com os{' '}
                <Link
                  href="/termos"
                  target="_blank"
                  className="text-primary underline"
                >
                  termos de uso
                </Link>
              </label>

              {/* input hidden para o FormData */}
              <input
                type="hidden"
                name="acceptTerms"
                value={acceptTerms ? 'true' : ''}
              />
            </div>

            <CardFooter className="px-0">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
