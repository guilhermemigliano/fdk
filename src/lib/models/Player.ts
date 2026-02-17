import { Schema, models, model } from 'mongoose';

const PlayerSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    sobrenome: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true }, // armazene em formato legível (pode normalizar para E.164 se quiser)
    country: {
      type: String,
      enum: ['BR', 'US', 'CA', 'PT'],
      required: true,
      default: 'BR',
    },
    posicao: { type: String, enum: ['Goleiro', 'Jogador'], required: true },
    fotoBase64: { type: String, required: true }, // base64 da imagem (limitado/validado na action)
    senhaHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    pushSubscription: {
      endpoint: { type: String },
      keys: {
        p256dh: { type: String },
        auth: { type: String },
      },
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    acceptTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual para nome completo
PlayerSchema.virtual('fullName').get(function (this: any) {
  return `${this.nome} ${this.sobrenome}`;
});

// Índice para busca rápida por whatsapp + country (opcional)
PlayerSchema.index({ whatsapp: 1, country: 1 }, { unique: true });

export default models.Player || model('Player', PlayerSchema);
