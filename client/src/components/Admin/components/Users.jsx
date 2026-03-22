import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserShield, FaUser, FaEnvelope, FaSearch, FaSync, FaUserCircle } from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/api/all/users`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 1).length,
    regular: users.filter(u => u.role !== 1).length
  };

  if (loading) return (
    <div className="p-8 space-y-8 animate-pulse bg-white min-h-screen">
      <div className="h-10 bg-slate-100 rounded-lg w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>)}
      </div>
      <div className="h-64 bg-slate-100 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8 scrollbar-hide">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-uppercase">User Directory</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and monitor all registered accounts.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all font-bold text-blue-600 shadow-sm"
        >
          <FaSync className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Accounts", value: stats.total, icon: <FaUserCircle />, color: "from-blue-600 to-indigo-600" },
          { label: "Administrators", value: stats.admins, icon: <FaUserShield />, color: "from-amber-500 to-orange-500" },
          { label: "Regular Users", value: stats.regular, icon: <FaUser />, color: "from-emerald-500 to-teal-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-12 -mt-12`}></div>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mb-8 max-w-md group"
      >
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900 font-bold text-sm shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl relative"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Identities (Member)</th>
                <th className="px-10 py-6">Communication (Email)</th>
                <th className="px-10 py-6">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      layout
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <span className="text-xl font-black">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-black text-slate-900 text-lg tracking-tight uppercase">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors font-medium">
                          <FaEnvelope size={12} className="text-blue-500/50" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        {user.role === 1 ? (
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-black text-[10px] tracking-widest uppercase">
                            <FaUserShield size={12} /> ADMIN
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[10px] tracking-widest uppercase">
                            <FaUser size={10} /> Member
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FaSearch size={60} className="mb-4 text-slate-400" />
                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-500">Zero Intel Matched</h3>
                        <p className="text-sm font-medium mt-2 text-slate-500">No system users match your query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Users;
