import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, X } from "lucide-react";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/watchlist";

import api from "../lib/api";
import StockSearchInput from "./StockSearchInput";

export default function WatchlistCard() {
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [allStocks, setAllStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [sortMode, setSortMode] = useState("none");
  const [loading, setLoading] = useState(true);

  /*  Initial Load  */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/stockvalues");
        const json = res.data;
        if (json.success) {
          setQuotes(json.data);
          setAllStocks(json.data);
        }

        const wl = await getWatchlist();
        setItems(wl.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /*  Search  */
  useEffect(() => {
    if (!query.trim()) return setResults([]);

    const q = query.toLowerCase();
    setResults(
      allStocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q),
      ),
    );
  }, [query, allStocks]);

  /*  Add / Remove  */
  const handleAdd = async (stock) => {
    const res = await addToWatchlist(stock);

    setItems((prev) =>
      prev.some((i) => i.symbol === stock.symbol)
        ? prev
        : [res.data, ...prev].slice(0, 6),
    );

    setQuery("");
    setResults([]);
  };

  const handleRemove = async (id) => {
    await removeFromWatchlist(id);
    const wl = await getWatchlist();
    setItems(wl.data.slice(0, 6));
  };

  /*  Merge + Sort  */
  const sortedItems = [...items]
    .map((item) => ({
      ...item,
      quote: quotes.find((q) => q.symbol === item.symbol),
    }))
    .sort((a, b) => {
      if (!a.quote || !b.quote || sortMode === "none") return 0;
      return sortMode === "gainers"
        ? b.quote.changePercent - a.quote.changePercent
        : a.quote.changePercent - b.quote.changePercent;
    });

  /*  Skeleton Loader  */
  if (loading || !quotes.length) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl border border-[#1f4d36]
          bg-gradient-to-br from-[#0f2519] to-[#050c08]
          p-7 shadow-2xl w-full h-[470px] mt-[-80px] animate-pulse"
      >
        {/* Header Skeleton */}
        <div className="flex justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-[#1f4d36] rounded"></div>
            <div className="h-10 w-48 bg-[#1f4d36] rounded"></div>
            <div className="h-3 w-40 bg-[#1f4d36] rounded"></div>
          </div>

          <div className="h-12 w-20 bg-[#1f4d36] rounded-xl"></div>
        </div>

        {/* Chart Skeleton */}
        <div className="absolute inset-x-0 bottom-0 h-40 px-7 pb-6">
          <div className="w-full h-full bg-[#1f4d36]/60 rounded-xl"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="absolute bottom-5 left-7 right-7 flex justify-between">
          <div className="h-3 w-20 bg-[#1f4d36] rounded"></div>
          <div className="h-3 w-28 bg-[#1f4d36] rounded"></div>
        </div>
      </div>
    );
  }

  /*  Main Content  */
  return (
    <div
      className="w-full mt-[-80px] p-6 rounded-2xl border border-[#1f4d36]
      bg-gradient-to-br from-[#0f2519] to-[#0b1c14] shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Watchlist</h3>

        <div className="flex gap-2">
          <StockSearchInput
            allStocks={allStocks}
            onAdd={handleAdd}
            className="w-63"
          />

          <Button
            size="icon"
            variant="ghost"
            aria-label="Sort movers"
            onClick={() =>
              setSortMode((p) => (p === "gainers" ? "losers" : "gainers"))
            }
            className="bg-[#143f2a] text-[#7fb89b] hover:text-white"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div
        className="grid grid-cols-12 gap-3 px-3 pb-2 text-[11px]
        uppercase tracking-wider text-[#5f7b63] border-b border-[#1f4d36]"
      >
        <div className="col-span-3">Name</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-3 text-right">Change</div>
        <div className="col-span-3 text-right mr-[20px]">Volume</div>
      </div>

      {/* Rows */}
      <div className="space-y-3 mt-3">
        {sortedItems.map(({ _id, symbol, name, quote }) => {
          const positive = quote?.change >= 0;

          return (
            <div
              key={_id}
              className="grid grid-cols-12 gap-3 items-center p-3
              rounded-xl bg-[#122c1c]"
            >
              <div className="col-span-3">
                <div className="text-white font-medium">{symbol}</div>
                <div className="text-xs text-[#7fb89b]">{name}</div>
              </div>

              <div className="col-span-2 text-right text-white">
                {quote ? quote.current.toFixed(2) : "--"}
              </div>

              <div
                className={`col-span-3 text-right font-semibold text-sm ${
                  positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {quote
                  ? `${positive ? "+" : ""}${quote.change} (${quote.changePercent.toFixed(
                      2,
                    )}%)`
                  : "--"}
              </div>

              <div className="col-span-3 text-right text-xs text-[#7fb89b] mr-[20px]">
                {quote ? quote.volume.toLocaleString() : "--"}
              </div>

              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleRemove(_id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
