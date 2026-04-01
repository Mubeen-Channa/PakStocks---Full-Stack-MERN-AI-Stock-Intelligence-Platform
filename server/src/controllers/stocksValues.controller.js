import axios from "axios";
import * as cheerio from "cheerio";

export const getStockValues = async (req, res) => {
  try {
    const url = "https://dps.psx.com.pk/market-watch";

    const response = await axios.get(url, {
      headers: {
        Referer: "https://dps.psx.com.pk/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 120000,
    });

    const $ = cheerio.load(response.data);
    const stocks = [];

    $(".tbl__body tr").each((_, el) => {
      const cols = $(el).find("td");

      const symbol = cols.eq(0).attr("data-search");
      if (!symbol) return;

      stocks.push({
        symbol,
        name: cols.eq(0).find(".tbl__symbol").attr("data-title") || "",
        ldcp: Number(cols.eq(3).attr("data-order")) || 0,
        open: Number(cols.eq(4).attr("data-order")) || 0,
        high: Number(cols.eq(5).attr("data-order")) || 0,
        low: Number(cols.eq(6).attr("data-order")) || 0,
        current: Number(cols.eq(7).attr("data-order")) || 0,
        change: Number(cols.eq(8).attr("data-order")) || 0,
        changePercent: Number(cols.eq(9).attr("data-order")) || 0,
        volume: Number(cols.eq(10).attr("data-order")) || 0,
      });
    });

    if (!stocks.length) {
      return res.status(500).json({
        success: false,
        message: "PSX table structure changed or blocked",
      });
    }
    
    res.json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (err) {
    console.error("PSX scrape failed:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stock values",
    });
  }
};
