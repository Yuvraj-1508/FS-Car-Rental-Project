import React, { useState } from "react";
import { FaUserShield, FaLock, FaEnvelope, FaCar } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${base_url}/api/login`, { email, password });

      if (res.data?.success) {
        const roleNum = parseInt(res.data.role);
        if (roleNum === 1) {
          toast.success("Admin access granted!");
          localStorage.setItem("Authorization", `Bearer ${res.data.token}`);
          localStorage.setItem("UserName", res.data.name);
          localStorage.setItem("UserRole", String(res.data.role));
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          toast.error("Access denied. Admin privileges required.");
        }
      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-2xl shadow-blue-500/20 mb-6 group">
            <FaUserShield size={32} className="group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-2">
            LuxAdmin <span className="text-blue-500 italic">Portal</span>
          </h1>
          <p className="text-slate-400 font-medium">Secure entry for system administrators</p>
        </div> */}

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Admin Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gocar.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Security Token</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login
                  {/* <FaCar className="group-hover:translate-x-1 transition-transform" /> */}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
              {/* Security Protocol v4.0.2 Active */}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2"
            >
              {/* Return to Public Site */}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
