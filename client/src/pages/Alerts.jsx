import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getAlerts,
  createAlert,
  checkAlerts,
  deleteAlert,
  markAlertsSeen,
} from "@/lib/alerts";

import api from "@/lib/api";
import StockSearchInput from "@/components/StockSearchInput";

export default function Alerts() {
  const queryClient = useQueryClient();

  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("above");
  const [allStocks, setAllStocks] = useState([]);

  /* ================= REFS ================= */
  const audioRef = useRef(null);

  /* ================= AUDIO SETUP ================= */
  useEffect(() => {
    audioRef.current = new Audio("/alert.mp3");

    const unlock = () => {
      audioRef.current
        ?.play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        })
        .catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
  }, []);

  /* ================= NOTIFICATION PERMISSION ================= */
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  /* ================= LOAD STOCKS ================= */
  useEffect(() => {
    async function loadStocks() {
      try {
        const res = await api.get("/stockvalues");
        if (res.data?.success) {
          setAllStocks(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load stocks:", err);
      }
    }
    loadStocks();
  }, []);

  /* ================= ALERTS QUERY ================= */
  const { data: alerts = [] } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
    refetchInterval: 120000,
    refetchIntervalInBackground: true,
  });

  /* ================= MUTATIONS ================= */
  const createMutation = useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      setSymbol("");
      setTargetPrice("");
    },
  });

  const checkMutation = useMutation({
    mutationFn: checkAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const markSeenMutation = useMutation({
    mutationFn: markAlertsSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  /* ================= AUTO CHECK ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      checkMutation.mutate();
    }, 120000);

    return () => clearInterval(interval);
  }, [checkMutation]);

  /* ================= NOTIFY ONLY ONCE ================= */
  useEffect(() => {
    const unseenTriggered = alerts.filter((a) => a.triggered && !a.seen);

    if (!unseenTriggered.length) return;

    unseenTriggered.forEach((alert) => {
      audioRef.current?.play().catch(() => {});

      if (Notification.permission === "granted") {
        new Notification("🎯 Target Hit!", {
          body: `${alert.symbol} crossed ${alert.targetPrice}`,
        });
      }
    });

    // Mark as seen so they NEVER repeat
    markSeenMutation.mutate();
  }, [alerts]);

  /* ================= FORM SUBMIT ================= */
  function handleSubmit(e) {
    e.preventDefault();
    if (!symbol || !targetPrice) return;

    createMutation.mutate({
      symbol: symbol.toUpperCase(),
      targetPrice: Number(targetPrice),
      direction,
    });
  }

  /* ================= DERIVED ================= */
  const activeAlerts = alerts.filter((a) => !a.triggered);
  const completedAlerts = alerts.filter((a) => a.triggered);

  function getProgress(alert, current) {
    if (!current || !alert.targetPrice) return 0;

    const progress =
      alert.direction === "above"
        ? (current / alert.targetPrice) * 100
        : (alert.targetPrice / current) * 100;

    return Math.min(progress, 120); // allow >100%
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🎯 Set Targets</h1>
          <p className="text-slate-400 text-sm mt-1 ml-2">
            Track and manage your price alerts
          </p>
        </div>

        <Button
          onClick={() => checkMutation.mutate()}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {checkMutation.isPending ? "Checking..." : "Check Targets"}
        </Button>
      </div>

      {/* CREATE ALERT */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Create Price Alert</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <StockSearchInput
              allStocks={allStocks}
              value={symbol}
              onSelect={(sym) => setSymbol(sym)}
              onSelectStock={(stock) => {
                setSymbol(stock.symbol);
                if (stock.current) {
                  setTargetPrice(stock.current.toFixed(2));
                }
              }}
              className="w-80"
            />

            <Input
              type="number"
              placeholder="Target Price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="bg-white/5 text-white w-30 ml-21"
              required
            />

            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-[#0f172a] text-white">
                <SelectItem value="above">📈 Above</SelectItem>
                <SelectItem value="below">📉 Below</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {createMutation.isPending ? "Setting..." : "Set Alert"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ALERT LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ACTIVE */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold">
            Active Targets ({activeAlerts.length})
          </h2>

          {activeAlerts.map((alert) => {
            const current =
              allStocks.find((s) => s.symbol === alert.symbol)?.current || 0;

            return (
              <motion.div
                key={alert._id}
                whileHover={{ scale: 1.01 }}
                className="
                  relative rounded-2xl p-5
                  bg-gradient-to-br from-emerald-950/90 to-emerald-900/60
                  border border-emerald-500/30
                  shadow-xl shadow-emerald-500/10
                "
              >
                {/* TOP RIGHT STATUS */}
                <div className="flex items-start justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-green-400 font-bold">
                      {alert.symbol.slice(0, 4)}
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-white">
                        {alert.symbol}
                      </p>
                      <p className="text-xs text-emerald-300">
                        Construction & Materials
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex gap-10 text-right">
                    <div>
                      <p className="text-xs text-emerald-300">CURRENTPRICE</p>
                      <p className="text-lg font-bold text-green-400">
                        {current.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-emerald-300">TARGETPRICE</p>
                      <p className="text-lg font-bold text-white">
                        {alert.targetPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-emerald-300 mb-1">
                    <span>
                      PROGRESS {getProgress(alert, current).toFixed(1)}%
                    </span>
                    <span className="text-green-400">
                      CONDITION: {alert.direction.toUpperCase()}{" "}
                      {alert.targetPrice}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-emerald-900 overflow-hidden">
                    <div
                      className="h-full bg-green-400 transition-all duration-700"
                      style={{
                        width: `${getProgress(alert, current)}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= COMPLETED ================= */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold">
            Completed Targets ({completedAlerts.length})
          </h2>

          {completedAlerts.length === 0 && (
            <p className="text-sm text-slate-400">No targets hit yet</p>
          )}

          <div
            className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-1
      lg:grid-cols-2
    "
          >
            {completedAlerts.map((alert) => (
              <motion.div
                key={alert._id}
                whileHover={{ scale: 1.03 }}
                className="
          relative p-4 rounded-2xl
          bg-gradient-to-br from-emerald-800/70 to-emerald-900/60
          border border-green-400/40
          shadow-lg shadow-green-500/15
        "
              >
                {/* TARGET HIT BADGE */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-400 text-black">
                    🎯 HIT
                  </span>
                </div>

                {/* SYMBOL */}
                <p className="text-lg font-bold text-white tracking-wide">
                  {alert.symbol}
                </p>

                {/* CONDITION */}
                <p className="text-xs text-green-300 mt-1">
                  {alert.direction.toUpperCase()} {alert.targetPrice}
                </p>

                {/* TIME */}
                <p className="text-[11px] text-green-200 mt-9">
                  {new Date(alert.triggeredAt).toLocaleString()}
                </p>

                {/* ACTION */}
                <button
                  onClick={() => deleteMutation.mutate(alert._id)}
                  className="
            absolute bottom-3 right-3
            text-xs text-red-400
            opacity-70 hover:opacity-100
            transition
          "
                >
                  x
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
