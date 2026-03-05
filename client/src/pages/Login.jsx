import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { ShieldCheck, Moon, Sun, TrendingUp } from "lucide-react";

import api from "../lib/api";

export default function Login({ onLogin }) {
  const [dark, setDark] = useState(false);

  const navigate = useNavigate();

  /* Dark Mode */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  /* Google Login */
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await api.post("/auth/google", { token });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
                    bg-slate-100 dark:bg-[#0b1c14] 
                    transition-colors duration-300 p-6 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl"
      >
        <Card className="overflow-hidden rounded-3xl shadow-2xl border-0 p-0 relative">
          {/* GRID */}
          <div className="grid md:grid-cols-2 min-h-[600px] md:min-h-[520px]">
            {/*  LEFT PANEL */}
            <div
              className="flex h-full w-full flex-col justify-between p-8 sm:p-10 lg:p-12 text-white
                      bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700"
            >
              <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                PakStocks
              </div>

              <div className="mt-10 md:mt-0">
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug">
                  Invest <br /> Smarter.
                </h1>
                <p className="mt-3 md:mt-6 text-emerald-100 max-w-sm md:max-w-md text-xs md:text-xs lg:text-sm">
                  Smart PSX tracking. Real-time alerts. Custom watchlists.
                  AI-driven market insights for every investor.
                </p>
              </div>

              <div className="hidden md:block text-sm text-emerald-100 mt-0">
                © Developed By Mubeen Channa • Version 2.0
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div
              className="relative flex items-center justify-center text-center
                      p-6 sm:p-10 lg:p-12
                      bg-white dark:bg-[#0f2519] transition-colors duration-300"
            >
              {/* Dark Mode Button inside card */}
              <div className="absolute z-20 top-[-296px] right-0 sm:top-[-315px] md:top-0 lg:top-0">
                <button
                  onClick={toggleDark}
                  className="h-9 w-14 rounded-full bg-white dark:bg-[#122c1c] 
                       border border-slate-200 dark:border-[#1f4d36]
                       flex items-center justify-center transition"
                >
                  {dark ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              </div>

              <div className="w-full max-w-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome back 👋
                </h2>

                <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-[#7fb89b]">
                  Sign in with Google to continue your journey.
                </p>

                <div className="mt-6 sm:mt-8 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => alert("Google Login Failed")}
                    theme={dark ? "filled_black" : "outline"}
                    size="large"
                    width="100%"
                  />
                </div>

                <div className="mt-10 sm:mt-14 text-xs text-slate-400 dark:text-[#5f7b63] uppercase tracking-widest">
                  Coming Soon
                </div>

                <button
                  disabled
                  className="mt-4 w-full h-11 rounded-xl border border-slate-200 dark:border-[#1f4d36]
                       text-slate-400 dark:text-[#5f7b63] cursor-not-allowed"
                >
                  Sign in with Email
                </button>

                <p className="text-xs mt-6 sm:mt-8 text-slate-500 dark:text-[#7fb89b]">
                  By continuing, you agree to our <br />
                  <span className="text-emerald-600 dark:text-green-400 font-medium">
                    Terms of Service & Privacy Policy
                  </span>
                  .
                </p>

                <div className="mt-6 sm:mt-8 flex justify-center">
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full
                            bg-emerald-50 dark:bg-[#122c1c]
                            text-emerald-700 dark:text-green-400
                            text-sm font-medium"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Secure Enterprise Login
                  </div>
                </div>

                {/* Footer for small screens */}
                <div className="block lg:hidden text-[10px] md:hidden text-black mt-6 dark:text-[#7fb89b]">
                  © Developed By Mubeen Channa • Version 2.0
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
