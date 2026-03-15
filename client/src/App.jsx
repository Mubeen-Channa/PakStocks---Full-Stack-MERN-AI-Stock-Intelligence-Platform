import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "@/pages/Login";
import DashboardLayout from "@/pages/DashboardLayout";
import Alerts from "@/pages/Alerts";
import Portfolio from "@/pages/Portfolio";
import Prediction from "@/pages/Prediction";
import News from "@/pages/News";

// Components of Dashboard
import KSE100Card from "@/components/KSE100Card";

/* Dashboard Home */
function DashboardHome({ user }) {
  return (
    <div className="w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KSE100Card user={user} />
        </div>
        <div className="lg:col-span-1"></div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2"></div>
        <div className="lg:col-span-1"></div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={<DashboardLayout user={user} />}
      >
        <Route path="set-targets" element={<Alerts />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="news" element={<News />} />
      </Route>
    </Routes>
  );
}