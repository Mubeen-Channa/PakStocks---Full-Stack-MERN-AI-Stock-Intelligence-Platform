import { getAllLivePrices } from "./market.service.js";
import { StockPrice } from "../models/StockPrice.js";
import { TRACKED_STOCKS } from "../config/trackedStocks.js";

export async function collectStockPrices() {
  try {
    const prices = await getAllLivePrices();

    // Filter only selected stocks
    const filtered = Object.entries(prices).filter(([symbol]) =>
      TRACKED_STOCKS.includes(symbol)
    );

    if (!filtered.length) return;

    // Get latest prices to avoid duplicates
    const latestDocs = await StockPrice.aggregate([
      {
        $match: {
          symbol: { $in: TRACKED_STOCKS },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$symbol",
          lastPrice: { $first: "$price" },
        },
      },
    ]);

    const lastPriceMap = {};
    latestDocs.forEach((d) => {
      lastPriceMap[d._id] = d.lastPrice;
    });

    // Only store if price changed
    const bulkData = filtered
      .filter(([symbol, price]) => lastPriceMap[symbol] !== price)
      .map(([symbol, price]) => ({
        insertOne: {
          document: {
            symbol,
            price,
            timestamp: new Date(),
          },
        },
      }));

    if (bulkData.length) {
      await StockPrice.bulkWrite(bulkData);
      console.log(`✅ Stored ${bulkData.length} updated prices`);
    } else {
      console.log("⏭ No price changes");
    }
  } catch (err) {
    console.error("❌ Price collection failed:", err.message);
  }
}