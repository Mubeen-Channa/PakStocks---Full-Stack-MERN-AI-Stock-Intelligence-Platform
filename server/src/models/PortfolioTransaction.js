import mongoose from "mongoose";

const portfolioTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    exchange: {
      type: String,
      default: "PSX",
      trim: true,
    },

    sector: {
      type: String,
      default: "Others",
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0.2, // percent
      min: 0,
    },

    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
  },
  { timestamps: true }
);

/* Prevent overselling */
portfolioTransactionSchema.pre("save", async function () {
  if (this.type !== "SELL") return;

  const PortfolioTransaction = mongoose.model("PortfolioTransaction");

  const transactions = await PortfolioTransaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(this.userId),
        symbol: this.symbol,
      },
    },
    {
      $group: {
        _id: "$symbol",
        totalBought: {
          $sum: {
            $cond: [{ $eq: ["$type", "BUY"] }, "$quantity", 0],
          },
        },
        totalSold: {
          $sum: {
            $cond: [{ $eq: ["$type", "SELL"] }, "$quantity", 0],
          },
        },
      },
    },
  ]);

  const totalBought = transactions[0]?.totalBought || 0;
  const totalSold = transactions[0]?.totalSold || 0;

  const currentHolding = totalBought - totalSold;

  if (this.quantity > currentHolding) {
    throw new Error(
      `Insufficient shares: Trying to sell ${this.quantity}, but only ${currentHolding} available`
    );
  }
});

export const PortfolioTransaction = mongoose.model(
  "PortfolioTransaction",
  portfolioTransactionSchema
);