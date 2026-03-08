  import { useState, useMemo, useEffect, useRef } from "react";
  import { Input } from "@/components/ui/input";
  import { AnimatePresence, motion } from "framer-motion";
  import { cn } from "@/lib/utils";

  const MAX_STOCKS = 300;

  export default function StockSearchInput({
    allStocks,
    value = "",
    onChange,
    onSelect,
    onSelectStock,
    onAdd,
    placeholder = "Search stocks...",
    className = "",
  }) {
    const isDropdownMode = Array.isArray(allStocks);

    const [query, setQuery] = useState(value);
    const [debounced, setDebounced] = useState(value);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    /* -------- Sync external value -------- */
    useEffect(() => {
      setQuery(value || "");
    }, [value]);

    /* -------- Debounce (dropdown only) -------- */
    useEffect(() => {
      if (!isDropdownMode) return;
      const t = setTimeout(() => setDebounced(query), 250);
      return () => clearTimeout(t);
    }, [query, isDropdownMode]);

    /* -------- Outside click -------- */
    useEffect(() => {
      if (!isDropdownMode) return;

      function handleClickOutside(e) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
          setOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownMode]);

    /* -------- Safe stocks -------- */
    const safeStocks = isDropdownMode
      ? allStocks.length > MAX_STOCKS
        ? allStocks.slice(0, MAX_STOCKS)
        : allStocks
      : [];

    /* -------- Filter results -------- */
    const results = useMemo(() => {
      if (!isDropdownMode || !debounced.trim()) return [];

      const q = debounced.toLowerCase();

      return safeStocks
        .filter(
          (s) =>
            s.symbol?.toLowerCase().includes(q) ||
            s.name?.toLowerCase().includes(q)
        )
        .slice(0, 10);
    }, [debounced, safeStocks, isDropdownMode]);

    function handleSelect(stock) {
      onSelect?.(stock.symbol);
      onSelectStock?.(stock);
      onAdd?.(stock);

      setQuery(stock.symbol);

      setQuery("");
      onChange?.(""); 

      setOpen(false);
    }

    return (
      <div ref={wrapperRef} className={cn("relative", className)}>
        <Input
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => isDropdownMode && setOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            onChange?.(val);
            if (isDropdownMode) setOpen(true);
          }}
          className="bg-white/5 border-white/10 text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 rounded-xl"
        />

        {/* Dropdown Mode Only */}
        {isDropdownMode && (
          <AnimatePresence initial={false}>
            {open && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="
                  absolute z-50 mt-3 w-full max-h-80 overflow-auto
                  rounded-2xl
                  bg-[#0b1220]/95 backdrop-blur-xl
                  border border-green-500/20
                  shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                "
              >
                {results.map((s) => (
                  <button
                    key={s.symbol}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="w-full px-4 py-3 text-left hover:bg-green-500/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="px-2 py-0.5 ml-[-1px] rounded bg-green-500/20 text-green-400 text-[10px] font-semibold">
                          {s.symbol}
                        </span>
                        <div className="text-[10px] text-slate-400 truncate">
                          {s.name}
                        </div>
                      </div>

                      {s.current && (
                        <div className="text-sm font-semibold text-white">
                          {s.current.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }