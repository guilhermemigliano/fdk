import mongoose, { Schema, models, model } from 'mongoose';

const MatchSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    matchId: {
      type: 'String',
      required: true,
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
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],

    playersTeam2: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],

    team1: {
      type: String,
      required: true,
    },

    team2: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  },
);

export default models.Match || model('Match', MatchSchema);
