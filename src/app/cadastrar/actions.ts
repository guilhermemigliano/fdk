'use server';

import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import { playerSchema } from './schema';
import bcrypt from 'bcryptjs';

export async function criarJogador(formData: FormData) {
  try {
    await connectDB();

    // Extrai dados do form
    const raw = {
      nome: formData.get('nome'),
      sobrenome: formData.get('sobrenome'),
      whatsapp: formData.get('whatsapp'),
      country: formData.get('country'),
      posicao: formData.get('posicao'),
      fotoBase64: formData.get('fotoBase64'),
      senha: formData.get('senha'),
      role: formData.get('role') || 'user',
    };

    // Validação Zod
    const parsed = playerSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        error: 'Erro de validação.',
        details: parsed.error.flatten().fieldErrors,
      };
    }

    const { whatsapp, country } = parsed.data;

    // 🔥 VALIDAR SE WHATSAPP + COUNTRY É ÚNICO
    const existing = await Player.findOne({ whatsapp, country });
    if (existing) {
      return {
        error: 'Este WhatsApp já está cadastrado.',
      };
    }

    // 🔥 Validar tamanho da imagem
    const base64 = raw.fotoBase64 as string;
    const kb = (base64.length * 3) / 4 / 1024;
    if (kb > 1024) {
      return { error: 'A imagem deve ter no máximo 1MB.' };
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(raw.senha as string, 10);

    // Criar jogador
    await Player.create({
      ...parsed.data,
      senhaHash,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar jogador:', error);

    // Se for erro de índice único do Mongo
    if (error.code === 11000) {
      return {
        error: 'WhatsApp já cadastrado.',
        details: error.keyValue,
      };
    }

    return {
      error: 'Erro interno ao cadastrar jogador.',
      details: error?.message || null,
    };
  }
}
