import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaCar, FaClipboardList, FaMoneyBillWave, FaArrowRight, FaEye } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [visiter, setVisiter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

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
        
        // Revenue calculation
        const totalRevenue = bookings.reduce((acc, curr) => {
          const payment = Number(curr.TotalPay) || 0;
          return acc + (curr.status === "confirmed" || curr.status === "pending" ? payment : 0);
        }, 0);
        setRevenue(totalRevenue);

        // Chart data aggregation (Monthly Revenue)
        const monthlyData = bookings.reduce((acc, b) => {
          const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + (Number(b.TotalPay) || 0);
          return acc;
        }, {});
        
        const formattedData = Object.keys(monthlyData).map(m => ({ 
            name: m, 
            revenue: monthlyData[m] 
        }));
        setChartData(formattedData);
      }

    } catch (err) {
      console.error("Dashboard error:", err);
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
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex justify-between items-end"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Fleet Command</h1>
          <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Operational Oversight & Logistics</p>
        </div>
        <div className="hidden md:block">
           <button onClick={fetchDashboardData} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">Refresh Sync</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={stat.link} className="block group">
              <div className="relative overflow-hidden bg-slate-50 border border-slate-100 p-6 rounded-3xl transition-all duration-500 hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5">
                <div className={`p-3 w-fit rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon, { size: 18 })}
                </div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Performance</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Financial Trajectory</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gross Income</span>
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                  cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white flex flex-col justify-between"
        >
          <div>
             <h2 className="text-xl font-black uppercase tracking-tight mb-2">Fleet Pulse</h2>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Health Status</p>
             <div className="mt-8 space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span>Utilization</span>
                      <span className="text-blue-400">84%</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[84%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span>Reliability</span>
                      <span className="text-emerald-400">99.2%</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99%]"></div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="mt-8 p-6 bg-slate-800/50 rounded-3xl border border-slate-800">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Valuation</p>
             <p className="text-3xl font-black text-white italic">₹{revenue.toLocaleString('en-IN')}</p>
             <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                <span className="p-1 bg-emerald-500/20 rounded-full">↑ 12%</span>
                <span>Vs Last Month</span>
             </div>
          </div>
          <Link to="/admin/bookings" className="w-full mt-6 py-4 bg-white text-slate-900 rounded-xl text-center font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Audit Logs</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
