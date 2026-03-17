import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getIndices } from "../lib";

const ALLOWED = ["KSE30", "KMI30", "KMIALLSHR"];

export default function MarketSummaryCard() {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getIndices();
        setIndices(data.data || []);
      } catch (e) {
        console.error("Failed to load indices", e);
      } finally {
        setLoading(false);
      }
    };

    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-[320px] w-[280px] rounded-3xl border border-[#1f4d36]
                   bg-gradient-to-br from-[#0f2519] to-[#0b1c14]
                   p-6 shadow-lg animate-pulse"
      >
        <div className="h-4 w-32 bg-[#1f4d36] rounded mb-6" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#122c1c] border border-white/5 space-y-2"
            >
              <div className="h-3 w-16 bg-[#1f4d36] rounded" />
              <div className="h-5 w-28 bg-[#1f4d36] rounded" />
              <div className="h-3 w-24 bg-[#1f4d36] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[320px] w-[280px] rounded-3xl border border-[#1f4d36]
                 bg-gradient-to-br from-[#0f2519] to-[#0b1c14]
                 p-6 shadow-lg text-[#7fb89b] flex flex-col"
    >
      <h3 className="text-white font-semibold mb-5">Market Summary</h3>

      <div className="space-y-4 ">
        {indices
          .filter(({ name }) => ALLOWED.includes(name))
          .slice(0, 3)
          .map((i) => (
            <IndexItem key={i.name} {...i} />
          ))}
      </div>
    </motion.div>
  );
}

/* Index Item */

function IndexItem({ name, current, change, percent }) {
  const delta = +change.replace(/,/g, "");
  const positive = delta >= 0;

  return (
    <div className="py-3 px-4 rounded-xl bg-[#122c1c] border border-white/5">
      <p className="text-[11px] uppercase tracking-wider">{name}</p>

      <p className="text-lg font-semibold text-white mt-0.5">
        {current}
      </p>

      <div
        className={`text-sm font-semibold ${
          positive ? "text-green-400" : "text-red-400"
        }`}
      >
        {positive ? "▲" : "▼"} {change}
        <span className="text-xs opacity-80 ml-1">{percent}</span>
      </div>
    </div>
  );
}