import { StockPrice } from "../models/StockPrice.js";

export async function getStockHistory(req, res) {
  const { symbol } = req.params;

  const data = await StockPrice.find({
    symbol: symbol.toUpperCase(),
  })
    .sort({ timestamp: 1 })
    .limit(500);

  res.json({
    success: true,
    data,
  });
}