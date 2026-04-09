import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaCar, FaHistory, FaChartBar, FaBars, FaTimes, FaMoneyCheckAlt, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.isExiting = true; // Bypass security lock
    window.location.replace("/admin");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Cars", path: "/admin/cars", icon: <FaCar /> },
    { name: "Orders", path: "/admin/bookings", icon: <FaHistory /> },
    { name: "Payments", path: "/admin/payments", icon: <FaMoneyCheckAlt /> },
    { name: "Stats", path: "/admin/visiter", icon: <FaChartBar /> },
  ];

  return (
    <>
      {/* Simple Mobile Toggle */}
      <button
        className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800/50 transition-transform duration-300 z-50 flex flex-col
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Premium Branding */}
        <div className="p-8 mb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
              <FaCar size={20} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                GO<span className="text-blue-600">ADMIN</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Fleet Control</span>
            </div>
          </Link>
        </div>

        {/* Menu List */}
        <nav className="flex-1 px-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                  : "text-slate-500 hover:text-white"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 pb-12 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 group group-active:scale-95"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
