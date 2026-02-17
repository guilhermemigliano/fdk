'use client';

import { useState } from 'react';
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
import Image from 'next/image';
import { countries } from '@/lib/countries';
import { applyMask } from '@/app/cadastrar/utils';
import { updateProfile } from './actions';
import { compressImage } from '@/app/cadastrar/utils';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ user }: any) {
  const [fotoBase64, setFotoBase64] = useState(user.fotoBase64 || '');
  const [country, setCountry] = useState(user.country || 'BR');
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedCountry = countries.find((c) => c.code === country)!;

  const handleImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setFotoBase64(compressed);
  };

  const handleWhatsapp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const masked = applyMask(raw, selectedCountry.mask);
    setWhatsapp(masked);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    formData.append('fotoBase64', fotoBase64);
    formData.append('country', country);

    const res = await updateProfile(formData);

    setLoading(false);

    if (res.error) {
      toast.error(res.error);

      return;
    }

    toast.success('Perfil atualizado com sucesso!');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Foto */}
      <div className="flex justify-center">
        <Image
          src={fotoBase64 || '/images/user-icon.png'}
          alt="Perfil"
          width={100}
          height={100}
          className="w-24 h-24 rounded-full object-cover border mt-2"
        />
      </div>

      <Input type="file" accept="image/*" onChange={handleImagem} />

      <Input
        name="nome"
        defaultValue={user.nome}
        placeholder="Nome"
        required
        disabled
      />
      <Input
        name="sobrenome"
        defaultValue={user.sobrenome}
        placeholder="Sobrenome"
        required
        disabled
      />

      <Input
        name="email"
        type="email"
        placeholder="E-mail"
        defaultValue={user.email}
        required
      />

      {/* País */}
      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="País" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {countries.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.label} ({c.dial})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* WhatsApp */}
      <Input
        name="whatsapp"
        placeholder={selectedCountry.mask}
        value={whatsapp}
        onChange={handleWhatsapp}
        required
      />

      {/* Posição */}
      <Select name="posicao" defaultValue={user.posicao}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Posição" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Goleiro">Goleiro</SelectItem>
          <SelectItem value="Jogador">Jogador</SelectItem>
        </SelectContent>
      </Select>

      {/* Senha (opcional) */}
      <Input type="password" name="senha" placeholder="Nova senha (opcional)" />

      <Button disabled={loading} type="submit" className="w-full">
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  );
}
