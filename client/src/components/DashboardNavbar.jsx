import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import api from "@/lib/api";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Set Targets", path: "/dashboard/set-targets" },
  { label: "Portfolio", path: "/dashboard/portfolio" },
  { label: "Prediction", path: "/dashboard/prediction" },
  { label: "News", path: "/dashboard/news" },
];

export default function DashboardNavbar({ user }) {
  const navigate = useNavigate();
  const [unseenCount, setUnseenCount] = useState(0);

  // Fetch unseen alerts count
  useEffect(() => {
    async function fetchUnseen() {
      try {
        const res = await api.get("/alerts");
        const unseen = res.data.filter(
          (alert) => alert.triggered && !alert.seen,
        ).length;
        setUnseenCount(unseen);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUnseen();

    // Optional: poll every 1 min
    const interval = setInterval(fetchUnseen, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async () => {
    try {
      // Mark all triggered alerts as seen
      await api.put("/alerts/mark-seen");
      setUnseenCount(0); // hide badge immediately
    } catch (err) {
      console.error(err);
    }

    // Navigate to Set Targets page
    navigate("/dashboard/set-targets");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#051a10]/80 backdrop-blur-md">
      <div className="max-w-[1150px] mx-auto flex items-center justify-between px-6 py-3 gap-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-10">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl text-green-400">
              query_stats
            </span>
            <p className="text-xl font-bold tracking-tight text-white">
              PakStocks
            </p>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive
                      ? "text-green-400 font-medium"
                      : "text-slate-400 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <IconButton
            icon="notifications"
            onClick={handleNotificationClick}
            badge={unseenCount} // new badge feature
          />

          {/* 👤 USER PROFILE */}
          <ProfileMenu user={user} />

          <IconButton
            icon="logout"
            danger
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          />
        </div>
      </div>
    </header>
  );
}

/* ---------------- Icon Button ---------------- */
function IconButton({ icon, onClick, danger, badge }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative h-9 w-9 rounded-lg flex items-center justify-center border transition-all ${
        danger
          ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <span
        className={`material-symbols-outlined text-[18px] ${
          danger ? "text-red-400" : "text-white"
        }`}
      >
        {icon}
      </span>

      {/* Badge */}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center font-bold text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

function ProfileMenu({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-55 ml-3">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 hover:bg-white/10"
      >
        {user.avatar ? (
  <img
    src={user.avatar}
    alt={user.name}
    referrerPolicy="no-referrer"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
    className="h-6 w-6 rounded-full object-cover"
  />
) : (
  <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
    {user.name?.[0]}
  </div>
)}
        <span className="hidden md:block text-sm text-white font-medium">
          {user.name}
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-55 rounded-xl bg-[#0b1220] border border-white/10 shadow-xl"
        >
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-[12px] font-semibold text-white">{user.name}</p>
            <p className="text-[10px] text-slate-400">{user.email}</p>
          </div>

          {/* <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button> */}
        </motion.div>
      )}
    </div>
  );
}
