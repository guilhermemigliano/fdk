import { Schema, models, model } from 'mongoose';

const MensalistaSchema = new Schema(
  {
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default models.Mensalista || model('Mensalista', MensalistaSchema);
