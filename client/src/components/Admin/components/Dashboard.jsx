import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaCar, FaClipboardList, FaMoneyBillWave, FaArrowRight, FaEye } from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [visiter, setVisiter] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authHeader = localStorage.getItem("Authorization");

      const [usersRes, carsRes, visiterRes, bookingsRes] = await Promise.all([
        axios.get(`${base_url}/api/all/users`),
        axios.get(`${base_url}/api/cars`),
        axios.get(`${base_url}/all/visiter`),
        axios.get(`${base_url}/api/all/booking`, { headers: { Authorization: authHeader } })
      ]);

      if (usersRes.data) setTotalUsers(usersRes.data.totalUsers);
      if (carsRes.data?.cars) setTotalCars(carsRes.data.cars.length);
      if (visiterRes?.data) setVisiter(visiterRes.data.total);

      if (bookingsRes.data?.success) {
        const bookings = bookingsRes.data.bookings;
        setTotalBookings(bookings.length);
        const totalRevenue = bookings.reduce((acc, curr) => {
          const payment = Number(curr.TotalPay) || 0;
          return acc + (curr.status === "confirmed" ? payment : 0);
        }, 0);
        setRevenue(totalRevenue);
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: <FaUsers />, color: "from-blue-600 to-blue-400", link: "/admin/users" },
    { label: "Total Cars", value: totalCars, icon: <FaCar />, color: "from-emerald-600 to-emerald-400", link: "/admin/cars" },
    { label: "Bookings", value: totalBookings, icon: <FaClipboardList />, color: "from-amber-600 to-amber-400", link: "/admin/bookings" },
    { label: "Revenue", value: `₹${revenue.toLocaleString('en-IN')}`, icon: <FaMoneyBillWave />, color: "from-indigo-600 to-indigo-400", link: "/admin/bookings" },
    { label: "Total Visitors", value: visiter, icon: <FaEye />, color: "from-rose-600 to-rose-400", link: "/admin/visiter" },
  ];

  if (loading) return (
    <div className="p-8 space-y-8 animate-pulse bg-white min-h-screen">
      <div className="h-10 bg-slate-100 rounded-lg w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Executive Overview</h1>
        <p className="text-slate-500 mt-2 text-lg">System analytics and performance metrics at a glance.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link} className="block group">
              <div className="relative overflow-hidden bg-slate-50 border border-slate-100 p-6 rounded-3xl transition-all duration-300 hover:bg-white hover:border-slate-200 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150`}></div>

                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <FaArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="mt-6">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-1 transition-all">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-50 border border-slate-100 p-8 rounded-3xl"
        >
          <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/cars" className="p-4 bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-600 rounded-2xl transition-all text-center font-bold text-slate-600 hover:text-white shadow-sm">
              Manage Fleet
            </Link>
            <Link to="/admin/bookings" className="p-4 bg-white border border-slate-200 hover:bg-amber-600 hover:border-amber-600 rounded-2xl transition-all text-center font-bold text-slate-600 hover:text-white shadow-sm">
              Review Bookings
            </Link>
            <Link to="/admin/users" className="p-4 bg-white border border-slate-200 hover:bg-emerald-600 hover:border-emerald-600 rounded-2xl transition-all text-center font-bold text-slate-600 hover:text-white shadow-sm">
              User Directory
            </Link>
            <Link to="/admin/visiter" className="p-4 bg-white border border-slate-200 hover:bg-rose-600 hover:border-rose-600 rounded-2xl transition-all text-center font-bold text-slate-600 hover:text-white shadow-sm">
              Visitor Logs
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center shadow-sm"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Business Health</h2>
            <p className="text-slate-500 mb-6 max-w-xs font-medium">Your fleet utilization is at optimal levels based on recent confirmed bookings.</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-indigo-600">₹{revenue.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Revenue Target</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 text-indigo-100 opacity-50">
            <FaMoneyBillWave size={120} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
