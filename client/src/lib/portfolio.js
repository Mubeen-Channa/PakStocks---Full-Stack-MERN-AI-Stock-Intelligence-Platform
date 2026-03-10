import api from "@/lib/api";

/*  GET PORTFOLIO  */
export const getPortfolio = async () => {
  try {
    const res = await api.get("/portfolio");

    // Ensure safe fallback
    return res?.data?.holdings || [];
  } catch (err) {
    console.error("GET portfolio failed:", err);
    throw err?.response?.data || { message: "Failed to fetch portfolio" };
  }
};

/*  ADD HOLDING  */
export const addHolding = async (payload) => {
  try {
    const res = await api.post("/portfolio", {
      ...payload,
      symbol: payload.symbol?.toUpperCase(), // 
      name: payload.name || payload.symbol, //  prevent missing name
    });

    return res?.data;
  } catch (err) {
    console.error("ADD holding failed:", err);

    // normalize error
    throw (
      err?.response?.data || {
        message: err.message || "Failed to add transaction",
      }
    );
  }
};

/*  DELETE HOLDING  */
export const deleteHolding = async (symbol) => {
  try {
    const res = await api.delete(
      `/portfolio/symbol/${symbol?.toUpperCase()}`
    );

    return res?.data;
  } catch (err) {
    console.error("DELETE holding failed:", err);

    throw (
      err?.response?.data || {
        message: err.message || "Failed to delete holding",
      }
    );
  }
};