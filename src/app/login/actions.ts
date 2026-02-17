'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import { signJwt } from '@/lib/jwt';

export async function login(formData: FormData) {
  try {
    await connectDB();

    const whatsapp = formData.get('whatsapp') as string;
    const country = formData.get('country') as string;
    const senha = formData.get('senha') as string;

    if (!whatsapp || !country || !senha) {
      return { error: 'Preencha todos os campos' };
    }

    const user = await Player.findOne({ whatsapp, country });
    if (!user) {
      return { error: 'Usuário não encontrado' };
    }

    const valid = await bcrypt.compare(senha, user.senhaHash);
    if (!valid) {
      return { error: 'Senha inválida' };
    }

    const token = signJwt({
      sub: user._id.toString(),
      role: user.role,
    });

    // ✅ FORMA CORRETA NO NEXT 16
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 3600, // 360 dias?
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Erro interno ao fazer login' };
  }
}
