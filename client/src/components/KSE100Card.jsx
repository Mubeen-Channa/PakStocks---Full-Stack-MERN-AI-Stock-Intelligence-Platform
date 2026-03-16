import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getIndices } from "../lib";

export default function KSE100Card({ user }) {
  if (!user) return null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getIndices();
        const kse100 = data.data.find((i) => i.name === "KSE100");
        if (!kse100) return;

        setData({
          name: kse100.name,
          value: +kse100.current.replace(/,/g, ""),
          change: +kse100.change.replace(/,/g, ""),
          percent: kse100.percent,
          updatedAt: Date.now(),
        });
      } catch (e) {
        console.error("Failed to load KSE100:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, []);

  if (loading || !data) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl border border-[#1f4d36]
                  bg-gradient-to-br from-[#0f2519] to-[#050c08]
                  p-7 shadow-2xl w-full h-[320px] animate-pulse"
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
        <div className="absolute bottom-10 left-12 right-12 flex justify-between">
          <div className="h-3 w-20 bg-[#1f4d36] rounded"></div>
          <div className="h-3 w-28 bg-[#1f4d36] rounded"></div>
        </div>
      </div>
    );
  }

  const positive = data.change >= 0;
  const color = positive ? "#22c55e" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-[#1f4d36]
                 bg-gradient-to-br from-[#0f2519] to-[#050c08] p-7 shadow-2xl
                 w-full h-[320px]"
    >
      {/* Glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at top right, ${color}20, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex justify-between">
        <div>
          <span className="text-[10px] tracking-widest text-[#7fb89b] uppercase">
            Market Index
          </span>
          <h2 className="text-4xl font-black text-white mt-1">
            {data.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>
          <p className="text-xs text-[#7fb89b] mt-1">
            Pakistan Stock Exchange (KSE100)
          </p>
        </div>

        <motion.div
          key={data.change}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-3 py-1.5 rounded-xl backdrop-blur-sm
            ${
              positive
                ? "text-green-400" 
                : "text-red-400"   
            }`}
        >
          <span className="text-sm font-bold">
            {positive ? "▲" : "▼"} {Math.abs(data.change)}
          </span>
          <div className="text-[10px] opacity-80">{data.percent}</div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none">
        <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0,90 C40,70 80,20 130,35 C180,50 230,110 280,90 C330,70 370,30 400,20 L400,140 L0,140 Z"
            fill="url(#grad)"
          />

          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0,90 C40,70 80,20 130,35 C180,50 230,110 280,90 C330,70 370,30 400,20"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-[170px] flex justify-between text-[10px] text-[#5c8a71] font-mono">
        <span>{data.name}</span>
        <span>Updated: {new Date(data.updatedAt).toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
}
