import { useEffect, useState, useMemo } from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { getPortfolio, addHolding, deleteHolding } from "@/lib/portfolio";
import { getStockValues } from "@/lib/stocks";
import StockSearchInput from "@/components/StockSearchInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

/* ================= SPARKLINE DATA ================= */
const sparkData = (price) => {
  return Array.from({ length: 10 }).map(() => ({
    v: price * (0.95 + Math.random() * 0.1),
  }));
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [allStocks, setAllStocks] = useState([]);

  const [loading, setLoading] = useState(true); // only first load
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const [selectedStock, setSelectedStock] = useState(null);
  const [price, setPrice] = useState("");
  const [volume, setVolume] = useState("");
  const [tax, setTax] = useState(0.2);
  const [type, setType] = useState("BUY");

  const [deleteSymbol, setDeleteSymbol] = useState(null);

  useEffect(() => {
    fetchPortfolio(true);
    fetchStocks();
  }, []);

  const fetchPortfolio = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const data = await getPortfolio();
      setHoldings(data || []);
    } catch {
      setError("Failed to load portfolio");
    } finally {
      if (initial) setLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const data = await getStockValues();
      setAllStocks(data || []);
    } catch {}
  };

  /* ================= ADD ================= */
  const handleAdd = async () => {
    setError("");

    if (!selectedStock?.symbol) return setError("Please select a stock");
    if (!price || !volume) return setError("Price & quantity required");

    const qty = Number(volume);

    if (type === "SELL") {
      const holding = holdings.find(
        (h) => h.symbol === selectedStock.symbol
      );

      if (!holding || holding.quantity < qty) {
        return setError(
          `You only have ${holding?.quantity || 0} shares`
        );
      }
    }

    try {
      setSubmitting(true);

      await addHolding({
        symbol: selectedStock.symbol.toUpperCase(),
        name: selectedStock.name || selectedStock.symbol,
        price: +price,
        quantity: qty,
        tax: +tax,
        type,
      });

      setSelectedStock(null);
      setPrice("");
      setVolume("");
      setTax(0.2);
      setType("BUY");

      await fetchPortfolio();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Transaction failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteHolding(deleteSymbol);
      await fetchPortfolio();
    } catch {
      setError("Delete failed");
    } finally {
      setDeleting(false);
      setDeleteSymbol(null);
    }
  };

  /* ================= NORMALIZE ================= */
  const normalized = useMemo(() => {
    return holdings
      .map((h) => {
        const avgCost = h.avgCost ?? 0;
        const qty = h.quantity || 0;
        const live = allStocks.find((s) => s.symbol === h.symbol);

        const currentPrice = live?.current ?? h.currentPrice ?? avgCost;
        const currentValue = qty * currentPrice;
        const invested = avgCost * qty;

        return {
          ...h,
          currentPrice,
          currentValue,
          totalPurchased: invested,
          profit: currentValue - invested,
          profitPercent:
            invested > 0 ? ((currentValue - invested) / invested) * 100 : 0,
        };
      })
      .filter(
        (s) =>
          s.quantity > 0 && // ✅ FIX: hide 0 shares
          (s.symbol.toLowerCase().includes(search.toLowerCase()) ||
            s.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        const cmp = a.symbol.localeCompare(b.symbol);
        return sortOrder === "asc" ? cmp : -cmp;
      });
  }, [holdings, allStocks, search, sortOrder]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const invested = normalized.reduce((a, b) => a + b.totalPurchased, 0);
    const current = normalized.reduce((a, b) => a + b.currentValue, 0);
    const profit = current - invested;

    return {
      invested,
      current,
      profit,
      percent: invested ? (profit / invested) * 100 : 0,
    };
  }, [normalized]);

  /* ================= REALIZED ================= */
  const realizedList = useMemo(() => {
    return holdings
      .filter((h) => h.realizedProfit && h.realizedProfit !== 0)
      .map((h) => ({
        symbol: h.symbol,
        value: h.realizedProfit,
      }));
  }, [holdings]);

  const totalRealized = realizedList.reduce((a, b) => a + b.value, 0);

  /* ================= PIE ================= */
  const pieData = normalized.map((s) => ({
    name: s.symbol,
    value: s.currentValue,
  }));

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-10 space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-[#123524] rounded" />
        <div className="h-40 bg-[#0b2a1a] rounded-xl" />
        <div className="h-80 bg-[#0b2a1a] rounded-xl" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-15">
          <h1 className="text-3xl font-bold text-white">Portfolio Performance</h1>
          <p className="text-slate-400 text-sm mt-1 ml-2">
            Real-time performance and smart insights for your investments  
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-4 ">
              <Summary label="TOTAL INVESTED" value={summary.invested} />
              <Summary label="CURRENT VALUE" value={summary.current} />

              <div className="bg-white/5 border border-[#1f4d35] p-4 rounded-xl">
                <p className="text-xs font-bold text-green-400">TOTAL PROFIT/LOSS</p>
                <p className={`text-lg font-semibold ${summary.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {summary.profit.toFixed(2)} ({summary.percent.toFixed(1)}%)
                </p>
              </div>
            </div>

            {/* TABLE */}
            <div className="rounded-xl border border-[#1f4d35] overflow-hidden">
              <div className="p-4 flex justify-between bg-[#0f3322]">
                <h3>Holdings</h3>

                <div className="flex gap-2 items-center">
                  <Search size={16} />
                  <input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-2 py-1 bg-[#082017] border rounded"
                  />
                  <button onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}>
                    <ArrowUpDown size={16} />
                  </button>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="text-slate-400 text-xs">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th>Price</th>
                    <th>Volume</th>
                    <th>Avg</th>
                    <th>Total Cost</th>
                    <th>P/L</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {normalized.map((s, i) => (
                    <tr key={i} className="border-t border-[#1f4d35]">
                      <td className="p-3">
                        <div>{s.symbol}</div>
                        <div className="text-xs text-slate-400">{s.name}</div>

                        <div className="h-6 w-24 mt-1">
                          <ResponsiveContainer>
                            <LineChart data={sparkData(s.currentPrice)}>
                              <Line
                                type="monotone"
                                dataKey="v"
                                stroke={s.profit >= 0 ? "#22c55e" : "#ef4444"}
                                dot={false}
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>

                      <td>{s.currentPrice.toFixed(2)}</td>
                      <td>{s.quantity}</td>
                      <td>{s.avgCost.toFixed(2)}</td>
                      <td>{s.totalPurchased.toFixed(2)}</td>

                      <td className={s.profit >= 0 ? "text-green-400" : "text-red-400"}>
                        {s.profit.toFixed(2)} ({s.profitPercent.toFixed(1)}%)
                      </td>

                      <td>
                        <button onClick={() => setDeleteSymbol(s.symbol)} className="text-red-400">
                          {deleting && deleteSymbol === s.symbol ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PIE */}
            <div className="bg-[#0b2a1a] border border-[#1f4d35] p-6 rounded-xl">
              <h3 className="mb-4 font-semibold">Sector Allocation</h3>
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="bg-[#0b2a1a] border border-[#1f4d35] p-6 rounded-xl space-y-4">
              <h3>Add Transaction</h3>

              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-[#082017]">
                <option>BUY</option>
                <option>SELL</option>
              </select>

              <StockSearchInput
                allStocks={allStocks}
                value={selectedStock?.symbol || ""}
                onChange={() => {}}
                onSelectStock={(s) => {
                  setSelectedStock(s);
                  if (s.current) setPrice(s.current.toFixed(2));
                }}
              />

              <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 bg-[#082017]" />
              <input placeholder="Quantity" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full px-3 py-2 bg-[#082017]" />
              <input placeholder="Tax %" value={tax} onChange={(e) => setTax(e.target.value)} className="w-full px-3 py-2 bg-[#082017]" />

              <button
                disabled={submitting}
                onClick={handleAdd}
                className="w-full py-3 rounded-md bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold flex justify-center items-center disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Add Transaction"
                )}
              </button>
            </div>

            {/* REALIZED */}
            <div className="bg-[#0b2a1a] border border-[#1f4d35] p-6 rounded-xl space-y-3">
              <h3>Realized Profit/Loss</h3>

              {realizedList.map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span>{r.symbol}</span>
                  <span className={r.value >= 0 ? "text-green-400" : "text-red-400"}>
                    {r.value.toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="pt-2 border-t border-[#1f4d35] font-semibold">
                Total: {totalRealized.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* DELETE */}
        <Dialog open={!!deleteSymbol} onOpenChange={() => setDeleteSymbol(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Holding</DialogTitle>
            </DialogHeader>

            <DialogFooter>
              <Button onClick={() => setDeleteSymbol(null)}>Cancel</Button>
              <Button onClick={handleDelete}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

function Summary({ label, value }) {
  return (
    <div className="bg-[#0b2a1a] border border-[#1f4d35] p-4 rounded-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-semibold">
        PKR {value.toLocaleString()}
      </p>
    </div>
  );
}