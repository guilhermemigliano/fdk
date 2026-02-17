import { z } from 'zod';
import { countries } from '../../lib/countries';

export const playerSchema = z
  .object({
    nome: z
      .string()
      .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
    sobrenome: z
      .string()
      .min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres.' }),
    email: z.string().email('E-mail inválido'),
    country: z.string().min(2, { message: 'País é obrigatório' }),
    whatsapp: z.string().min(5, { message: 'Número de WhatsApp inválido' }),
    posicao: z.enum(['Goleiro', 'Jogador'], {
      message: 'Selecione uma posição válida',
    }),
    fotoBase64: z.string().min(20, { message: 'Envie uma foto válida' }),
    senha: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
    role: z.enum(['admin', 'user']).default('user'),
    acceptTerms: z.string().refine((v) => v === 'true', {
      message: 'É necessário aceitar os termos',
    }),
  })
  .refine(
    (data) => {
      const country = countries.find((c) => c.code === data.country);
      if (!country) return false;

      return country.regex.test(data.whatsapp);
    },
    {
      message: 'Número de WhatsApp inválido para o país selecionado.',
      path: ['whatsapp'],
    },
  );

export type JogadorInput = z.infer<typeof playerSchema>;

export const updatePlayerSchema = z
  .object({
    nome: z
      .string()
      .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
      .optional(),
    sobrenome: z
      .string()
      .min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres.' })
      .optional(),
    email: z.string().email('E-mail inválido'),
    country: z.string().min(2, { message: 'País é obrigatório' }),
    whatsapp: z.string().min(5, { message: 'Número de WhatsApp inválido' }),
    posicao: z.enum(['Goleiro', 'Jogador'], {
      message: 'Selecione uma posição válida',
    }),
    fotoBase64: z.string().min(20, { message: 'Envie uma foto válida' }),
    senha: z
      .string()
      .min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' })
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const country = countries.find((c) => c.code === data.country);
      if (!country) return false;

      return country.regex.test(data.whatsapp);
    },
    {
      message: 'Número de WhatsApp inválido para o país selecionado.',
      path: ['whatsapp'],
    },
  );
