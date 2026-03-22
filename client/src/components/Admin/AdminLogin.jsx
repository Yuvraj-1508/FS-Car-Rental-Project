import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCar, FaLock, FaEnvelope, FaShieldAlt } from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // If already logged in as admin, redirect to admin dashboard
    useEffect(() => {
        const token = localStorage.getItem("Authorization");
        const role = parseInt(localStorage.getItem("UserRole"));
        if (token && role === 1) {
            navigate("/admin");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${base_url}/api/login`, { email, password });
            if (res.data?.success && parseInt(res.data.role) === 1) {
                toast.success("Admin access granted!");
                localStorage.setItem("Authorization", `Bearer ${res.data.token}`);
                localStorage.setItem("UserName", res.data.name);
                localStorage.setItem("UserRole", String(res.data.role));
                navigate("/admin");
            } else if (res.data?.success && parseInt(res.data.role) !== 1) {
                toast.error("Access denied. Admin credentials required.");
            } else {
                toast.error(res.data?.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Artistic background glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-12 shadow-2xl z-10"
            >
                {/* Branding */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6 group hover:rotate-6 transition-transform">
                        <FaShieldAlt size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                        LUX<span className="text-blue-600 italic">ADMIN</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3">Secure Command Interface</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">Credential Identifier</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@luxdrive.com"
                                className="w-full pl-14 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:border-blue-600 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">Access Keyphase</label>
                        <div className="relative">
                            <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-14 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:border-blue-600 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-blue-600 hover:bg-white hover:text-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 mt-8 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Bypass to Dashboard"
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Return to Public Interface
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
