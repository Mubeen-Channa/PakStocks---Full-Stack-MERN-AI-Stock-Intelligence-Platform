import api from "@/lib/api";

// Fetch all stock values from the API.
export async function getStockValues() {
  const res = await api.get("/stockvalues");
  const json = res.data;

  if (!json.success) {
    throw new Error("Failed to fetch stock values");
  }

  return json.data;
}

// Find a single stock quote by symbol.
export async function getStockBySymbol(symbol, stockValues) {
  const data = stockValues ?? (await getStockValues());
  return data.find((s) => s.symbol === symbol);
}

// Filter stocks by a search query (matches symbol or name).
export async function searchStocks(query, stockValues) {
  if (!query?.trim()) return [];

  const data = stockValues ?? (await getStockValues());
  const q = query.toLowerCase();

  return data.filter(
    (s) =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
  );
}