import axios from "axios";
import * as cheerio from "cheerio";

export async function getAllLivePrices() {
  try {
    const url = "https://dps.psx.com.pk/market-watch";

    const response = await axios.get(url, {
      headers: {
        Referer: "https://dps.psx.com.pk/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 60000,
    });

    const $ = cheerio.load(response.data);
    const prices = {};

    $(".tbl__body tr").each((_, el) => {
      const cols = $(el).find("td");
      const symbol = cols.eq(0).attr("data-search");

      if (!symbol) return;

      const currentPrice =
        Number(cols.eq(7).attr("data-order")) || 0;

      prices[symbol.toUpperCase()] = currentPrice;
    });

    return prices;
  } catch (err) {
    console.error("Live prices fetch failed:", err.message);
    return {};
  }
}