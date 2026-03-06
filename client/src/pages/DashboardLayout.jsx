import DashboardNavbar from "@/components/DashboardNavbar";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

export default function DashboardLayout( {user} ) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#04140d] via-[#0b2a1a] to-[#04140d] border-b border-[#1f4d35]">
      <DashboardNavbar user={user}/>

      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-[1200px] mx-auto px-20 py-6"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}