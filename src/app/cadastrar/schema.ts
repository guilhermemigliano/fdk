import { z } from 'zod';
import { countries } from '../../lib/countries';

export const playerSchema = z
  .object({
    nome: z.string().min(2),
    sobrenome: z.string().min(2),
    country: z.string().min(2),
    whatsapp: z.string().min(5),
    posicao: z.enum(['Goleiro', 'Jogador']),
    fotoBase64: z.string().min(20),
    senha: z.string().min(6),
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
    nome: z.string().min(2),
    sobrenome: z.string().min(2),
    country: z.string().min(2),
    whatsapp: z.string().min(5),
    posicao: z.enum(['Goleiro', 'Jogador']),
    fotoBase64: z.string().min(20),
    senha: z.string().min(6).optional().or(z.literal('')),
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
