import axios from "axios";
import * as cheerio from "cheerio";
import { PortfolioTransaction } from "../models/PortfolioTransaction.js";
import { CreatePortfolioSchema } from "../validators/portfolio.schema.js";

/*  FETCH LIVE PSX PRICES  */
const fetchLivePrices = async () => {
  const url = "https://dps.psx.com.pk/market-watch";

  const response = await axios.get(url, {
    headers: {
      Referer: "https://dps.psx.com.pk/",
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(response.data);
  const map = new Map();

  $(".tbl__body tr").each((_, el) => {
    const cols = $(el).find("td");
    const symbol = cols.eq(0).attr("data-search");
    if (!symbol) return;

    map.set(symbol, Number(cols.eq(7).attr("data-order")) || 0);
  });

  return map;
};

/*  GET PORTFOLIO  */
export async function getPortfolio(req, res) {
  const userId = req.user.id || req.user._id;

  const transactions = await PortfolioTransaction.find({ userId }).sort({ createdAt: 1 }); // oldest first

  if (!transactions.length) {
    return res.json({ success: true, holdings: [] });
  }

  let priceMap = new Map();
  try {
    priceMap = await fetchLivePrices();
  } catch (err) {
    console.error("Price fetch failed:", err.message);
  }

  const holdingsMap = new Map();

  for (const tx of transactions) {
    if (!holdingsMap.has(tx.symbol)) {
      holdingsMap.set(tx.symbol, {
        symbol: tx.symbol,
        name: tx.name,
        exchange: tx.exchange,
        sector: tx.sector,
        quantity: 0,
        invested: 0,
        realizedProfit: 0,
        totalSold: 0,
      });
    }

    const h = holdingsMap.get(tx.symbol);

    if (tx.type === "BUY") {
      h.quantity += tx.quantity;
      h.invested += tx.quantity * (tx.price + (tx.tax || 0) * tx.price / 100);
    }

    if (tx.type === "SELL") {
      if (h.quantity <= 0) continue;

      const avgCost = h.invested / h.quantity;
      const sellValue = tx.price * tx.quantity;
      const costValue = avgCost * tx.quantity;
      const profit = sellValue - costValue;

      h.realizedProfit += profit;
      h.totalSold += tx.quantity;

      h.quantity -= tx.quantity;
      h.invested -= costValue;

      h.quantity = Math.max(0, h.quantity);
      h.invested = Math.max(0, h.invested);
    }
  }

  const holdings = Array.from(holdingsMap.values())
    .map((h) => {
      const currentPrice = h.quantity > 0
        ? priceMap.get(h.symbol) ?? h.invested / h.quantity
        : 0;

      const currentValue = h.quantity * currentPrice;

      return {
        ...h,
        avgCost: h.quantity > 0 ? Number((h.invested / h.quantity).toFixed(2)) : 0,
        currentPrice: Number(currentPrice.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        profit: Number((currentValue - h.invested).toFixed(2)),
        realizedProfit: Number(h.realizedProfit.toFixed(2)),
        soldPercent: h.totalSold > 0 ? Number((h.realizedProfit / (h.avgCost * h.totalSold) * 100).toFixed(2)) : 0,
        soldQuantity: h.totalSold,
      };
    });

  res.json({ success: true, holdings });
}

/*  ADD HOLDING  */
export async function addHolding(req, res) {
  const userId = req.user.id || req.user._id;

  const parsed = CreatePortfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const holding = await PortfolioTransaction.create({
    userId,
    ...parsed.data,
    symbol: parsed.data.symbol.toUpperCase(),
  });

  res.status(201).json(holding);
}

/*  REMOVE HOLDING  */
export async function removeBySymbol(req, res) {
  const userId = req.user.id || req.user._id;
  const { symbol } = req.params;

  await PortfolioTransaction.deleteMany({
    userId,
    symbol: symbol.toUpperCase(),
  });

  res.json({ success: true });
}