import { useEffect, useState } from "react";
import api from "../lib/api";

export default function TopMoversCard() {
  const [activeTab, setActiveTab] = useState("contributors");
  const [contributors, setContributors] = useState([]);
  const [topVolume, setTopVolume] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        setLoading(true);

        const res = await api.get("/stockvalues");
        const json = res.data;

        if (!json.success) return;

        const stocks = json.data.filter(
          (s) => typeof s.volume === "number" && s.current > 0,
        );

        // Add turnover field
        const withTurnover = stocks.map((s) => ({
          ...s,
          turnover: s.current * s.volume,
        }));

        // Sort by turnover
        const sortedTurnover = [...withTurnover].sort(
          (a, b) => b.turnover - a.turnover,
        );

        // Sort by volume
        const sortedVolume = [...stocks].sort((a, b) => b.volume - a.volume);

        setContributors(sortedTurnover.slice(0, 4));
        setTopVolume(sortedVolume.slice(0, 4));
      } catch (err) {
        console.error("Failed to load market activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, []);

  const currentData = activeTab === "contributors" ? contributors : topVolume;

  /*  Skeleton Loader  */
  if (loading) {
    return (
      <div
        className="w-[280px] h-[430px] rounded-2xl border border-[#1f4d36]
          bg-gradient-to-br from-[#0f2519] to-[#050c08]
          p-6 shadow-lg flex flex-col animate-pulse"
      >
        <div className="h-6 w-32 bg-[#1f4d36] rounded mb-4"></div>

        {/* Tabs Skeleton */}
        <div className="flex gap-6 mb-4">
          <div className="h-4 w-24 bg-[#1f4d36] rounded"></div>
          <div className="h-4 w-20 bg-[#1f4d36] rounded"></div>
        </div>

        {/* List Skeleton */}
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center px-2 py-3
                rounded-lg bg-[#1f4d36]/50"
            >
              <div className="space-y-1">
                <div className="h-6 w-20 bg-[#1f4d36] rounded"></div>
                <div className="h-5 w-24 bg-[#1f4d36] rounded"></div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-6 w-12 bg-[#1f4d36] rounded ml-auto"></div>
                <div className="h-5 w-10 bg-[#1f4d36] rounded ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*  Main Content  */
  return (
    <div
      className="w-[280px] h-[430px] rounded-2xl border border-[#1f4d36]
        bg-gradient-to-br from-[#0f2519] to-[#0b1c14]
        p-6 shadow-lg text-[#7fb89b] flex flex-col"
    >
      <h3 className="text-white font-semibold text-lg mb-4">Market Activity</h3>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1f4d36]/50 text-xs">
        {["contributors", "volume"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1 mb-2 text-xs whitespace-nowrap relative ${
              activeTab === tab ? "text-green-400" : "text-[#5f7b63]"
            }`}
          >
            {tab === "contributors" ? "Top Contributors" : "Top Volume"}

            {activeTab === tab && (
              <span className="absolute top-10 left-0 w-full h-[2px] bg-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-4">
        {currentData.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between px-2 py-2
              rounded-lg hover:bg-[#1a3d2a]/30 transition group"
          >
            <div>
              <div className="text-white font-semibold">{stock.symbol}</div>
              <div className="text-xs text-[#5f7b63] group-hover:text-[#7fb89b]">
                {stock.name}
              </div>
            </div>

            <div className="text-right">
              <div className="text-white font-medium">
                {stock.current.toFixed(2)}
              </div>

              {activeTab === "contributors" ? (
                <div className="text-xs text-green-400 font-semibold">
                  {/* {(stock.turnover / 1000000).toFixed(1)}M */}
                  {formatMillionsToBillions(stock.turnover)}
                </div>
              ) : (
                <div className="text-xs text-green-400 font-semibold">
                  {/* {(stock.volume / 1000000).toFixed(1)}M Vol */}
                  {formatMillionsToBillions(stock.volume)} Vol
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const formatMillionsToBillions = (value) => {
  const inMillions = value / 1_000_000;

  if (inMillions >= 1000) {
    return `${(inMillions / 1000).toFixed(1)}B`;
  }

  return `${inMillions.toFixed(1)}M`;
};
