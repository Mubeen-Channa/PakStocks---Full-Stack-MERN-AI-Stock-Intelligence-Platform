import api from "@/lib/api";

// Get watchlist for current user
export const getWatchlist = async () => {
  const res = await api.get("/watchlist");
  return res.data;
};

// Add stock to watchlist
export const addToWatchlist = async ({ symbol, name, exchange }) => {
  const res = await api.post("/watchlist", {
    symbol,
    name,
    exchange,
  });
  return res.data;
};

// Remove stock from watchlist
export const removeFromWatchlist = async (id) => {
  const res = await api.delete(`/watchlist/${id}`);
  return res.data;
};
