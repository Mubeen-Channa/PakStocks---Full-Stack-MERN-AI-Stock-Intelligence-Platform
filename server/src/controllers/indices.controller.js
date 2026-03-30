import axios from "axios";
import { load } from "cheerio";

export async function getAllIndices(req, res) {
  try {
    const response = await axios.get("https://dps.psx.com.pk/indices");
    const html = response.data;
    const $ = load(html);

    const indices = [];

    // first table contains indices
    $("table")
      .first()
      .find("tr")
      .each((_, row) => {
        const cols = $(row).find("td");
        if (cols.length < 6) return;

        const name = $(cols[0]).text().trim();

        if (!name) return;

        indices.push({
          name,
          current: $(cols[3]).text().trim(),
          change: $(cols[4]).text().trim(),
          percent: $(cols[5]).text().trim(),
        });
      });

    if (!indices.length) {
      return res.status(404).json({
        success: false,
        message: "No indices found",
      });
    }

    res.json({
      success: true,
      data: indices,
    });
  } catch (error) {
    console.error("Indices scrape failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch indices",
    });
  }
}
