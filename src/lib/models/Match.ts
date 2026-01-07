import mongoose, { Schema, models, model } from 'mongoose';

const MatchSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    matchId: {
      type: String,
      required: true,
      unique: true, // 🔒 importante
      index: true,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },

    team1Score: {
      type: Number,
      default: 0,
    },

    team2Score: {
      type: Number,
      default: 0,
    },

    playersTeam1: [
      {
        player: { type: Schema.Types.ObjectId, ref: 'Player' },
        gol: Number,
        golContra: Number,
      },
    ],

    playersTeam2: [
      {
        player: { type: Schema.Types.ObjectId, ref: 'Player' },
        gol: Number,
        golContra: Number,
      },
    ],

    team1: {
      type: String,
      required: true,
      default: 'Time 1',
    },

    team2: {
      type: String,
      required: true,
      default: 'Time 2',
    },

    confirmation: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],

    confirmationPending: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    updatedBy: [
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

export default models.Match || model('Match', MatchSchema);
