import { useState } from "react";
import { motion } from "framer-motion";
import { getPrediction } from "@/services/predictService";

export default function Prediction() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePredict = async () => {
    if (!symbol) return;

    setLoading(true);
    setData(null);
    setError("");

    try {
      const [res] = await Promise.all([
        getPrediction(symbol.toUpperCase()),
        delay(5000), // ⏳ minimum 5 seconds loader
      ]);

      if (!res || !res.success) {
        setError("No data found for this stock.");
      } else {
        setData(res);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const getSignalColor = (signal) => {
    if (signal === "BUY") return "text-green-400";
    if (signal === "SELL") return "text-red-400";
    return "text-yellow-400";
  };

  const getRiskColor = (risk) => {
    if (risk === "LOW") return "text-green-400";
    if (risk === "HIGH") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="w-full max-w-2xl space-y-6">

        <h1 className="text-3xl font-bold text-center text-white">
          📊 AI Stock Prediction
        </h1>

        {/* Input */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (HBL, UBL...)"
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={handlePredict}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition text-white font-semibold flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Analyzing..." : "Predict"}
            </button>
          </div>
        </div>

        {/* 🔄 Loader */}
        {loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 text-center">
            <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-300">Analyzing stock data...</p>
          </div>
        )}

        {/* ❌ Error / No Data */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}

        {/* ✅ Result */}
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 shadow-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-white">
                {data.symbol} Analysis
              </h2>

              <span className={`text-lg font-bold ${getSignalColor(data.signal)}`}>
                {data.signal}
              </span>
            </div>

            <div className="mb-5">
              <p className="text-3xl font-bold text-white">
                Rs. {data.currentPrice}
              </p>
              <p
                className={`text-sm ${
                  data.changePercent >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {data.changePercent}%
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ["Entry", data.entry],
                ["Exit", data.exit],
                ["Stop Loss", data.stopLoss],
                ["Trend", data.trend],
                ["Risk", data.risk],
                ["Time", data.timeHorizon],
              ].map(([label, value], i) => (
                <div key={i} className="bg-black/40 p-3 rounded-xl">
                  <p className="text-gray-400">{label}</p>
                  <p
                    className={`font-semibold ${
                      label === "Risk" ? getRiskColor(value) : "text-white"
                    }`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}