import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    exchange: {
      type: String,
    },
  },
  { timestamps: true }
);

// one stock only once per user
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);
