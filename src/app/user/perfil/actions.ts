'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import bcrypt from 'bcryptjs';
import { updatePlayerSchema } from '@/app/cadastrar/schema';

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { error: 'Não autenticado.' };
  }

  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    return { error: 'Token inválido.' };
  }

  await connectDB();

  const raw = {
    //nome: formData.get('nome'),
    //sobrenome: formData.get('sobrenome'),
    country: formData.get('country'),
    whatsapp: formData.get('whatsapp'),
    email: formData.get('email'),
    posicao: formData.get('posicao'),
    fotoBase64: formData.get('fotoBase64'),
    senha: formData.get('senha'),
  };

  // Validação

  const parsed = updatePlayerSchema.safeParse(raw); // permite campos opcionais
  if (!parsed.success) {
    return {
      error: `Erro de validação.`,
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const { whatsapp, country, email } = parsed.data;

  // 🔥 VALIDAR SE WHATSAPP + COUNTRY É ÚNICO
  const existing = await Player.findOne({ whatsapp, country });
  if (existing && existing._id.toString() !== payload.sub) {
    return {
      error: 'Este WhatsApp já está cadastrado.',
    };
  }

  // 🔥 VALIDAR SE EMAIL É ÚNICO (exceto o próprio usuário)
  const existingEmail = await Player.findOne({
    email: email,
    _id: { $ne: payload.sub },
  });

  if (existingEmail) {
    return {
      error: 'Este e-mail já está cadastrado.',
    };
  }

  const updates: any = { ...parsed.data };

  // Tamanho da foto
  if (raw.fotoBase64) {
    const base64 = raw.fotoBase64 as string;
    const kb = (base64.length * 3) / 4 / 1024;

    if (kb > 1024) {
      return { error: 'A imagem deve ter no máximo 1MB.' };
    }

    updates.fotoBase64 = base64;
  }

  // SENHA OPCIONAL
  if (raw.senha && String(raw.senha).trim() !== '') {
    updates.senhaHash = await bcrypt.hash(raw.senha as string, 10);
  }

  await Player.findByIdAndUpdate(payload.sub, updates);

  return { success: true };
}
