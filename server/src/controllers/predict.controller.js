import { StockPrice } from "../models/StockPrice.js";
import { getTrendPrediction } from "../services/ml.service.js";

/*  Signal Logic  */
const calculateSignal = (prices, trend) => {
  const current = prices[prices.length - 1];
  const prev = prices[prices.length - 2];

  const changePercent = (((current - prev) / prev) * 100).toFixed(2);

  let signal = "HOLD";
  let risk = "MEDIUM";

  if (trend === "UP") {
    signal = "BUY";
    risk = changePercent > 1 ? "LOW" : "MEDIUM";
  } else if (trend === "DOWN") {
    signal = "SELL";
    risk = changePercent < -1 ? "LOW" : "HIGH";
  }

  return {
    currentPrice: current,
    changePercent,
    entry: current,
    exit: (current * 1.03).toFixed(2),
    stopLoss: (current * 0.985).toFixed(2),
    signal,
    risk,
    timeHorizon: "Short Term (1–7 days)",
  };
};

/*  Controller  */
export const getPrediction = async (req, res) => {
  try {
    const { symbol } = req.params;

    // Fetch last 10 prices
    const data = await StockPrice.find({ symbol })
      .sort({ timestamp: -1 })
      .limit(10);

    if (data.length < 5) {
      return res.json({
        success: false,
        message: "Not enough data for prediction",
      });
    }

    const prices = data.reverse().map((d) => d.price);

    /* ---------- Call ML Service ---------- */
    const trend = await getTrendPrediction({ prices });

    /* ---------- Generate Trading Signal ---------- */
    const signalData = calculateSignal(prices, trend);

    return res.json({
      success: true,
      symbol,
      trend,
      ...signalData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Prediction failed",
    });
  }
};