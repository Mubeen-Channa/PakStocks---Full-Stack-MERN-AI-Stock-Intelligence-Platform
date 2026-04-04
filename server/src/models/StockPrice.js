import mongoose from "mongoose";

const stockPriceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Fast queries for ML
stockPriceSchema.index({ symbol: 1, timestamp: 1 });

export const StockPrice = mongoose.model("StockPrice", stockPriceSchema);