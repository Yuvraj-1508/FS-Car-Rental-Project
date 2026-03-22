import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyCheckAlt, FaSearch, FaFilter, FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle, FaClock, FaArrowUp, FaArrowDown } from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const Payments = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const authHeader = localStorage.getItem("Authorization");
            const res = await axios.get(`${base_url}/api/all/booking`, {
                headers: { Authorization: authHeader },
            });

            if (res.data.success) {
                // We treat confirmed bookings as successful payments
                const paymentData = res.data.bookings.map(b => ({
                    id: b._id,
                    userName: b.userId?.name || "Unknown",
                    carName: b.carId?.carName || "Asset Decommissioned",
                    amount: Number(b.TotalPay) || 0,
                    date: b.createdAt,
                    status: b.status, // confirmed, pending, cancelled
                    method: "Digital Wallet/Card" // Default for now
                }));
                setTransactions(paymentData.sort((a, b) => new Date(b.date) - new Date(a.date)));
            }
        } catch (err) {
            console.error("Payment Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.includes(searchTerm) ||
            t.carName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.status === "confirmed" ? curr.amount : 0), 0);
    const pendingRevenue = transactions.reduce((acc, curr) => acc + (curr.status === "pending" ? curr.amount : 0), 0);

    if (loading) return (
        <div className="p-8 space-y-8 animate-pulse bg-white min-h-screen">
            <div className="h-10 bg-slate-100 rounded-lg w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl"></div>)}
            </div>
            <div className="h-96 bg-slate-50 rounded-[3rem]"></div>
        </div>
    );

    return (
        <div className="p-8 bg-white min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <FaFileInvoiceDollar size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Financial Ledger</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">PAYMENT <span className="text-indigo-600 italic underline decoration-indigo-500/30">HISTORY</span></h1>
            </motion.div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Realized Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<FaArrowUp />} color="text-emerald-600" bgColor="bg-emerald-50" />
                <StatCard label="Pending Volume" value={`₹${pendingRevenue.toLocaleString('en-IN')}`} icon={<FaClock />} color="text-amber-600" bgColor="bg-amber-50" />
                <StatCard label="Total Volume" value={`₹${(totalRevenue + pendingRevenue).toLocaleString('en-IN')}`} icon={<FaMoneyCheckAlt />} color="text-indigo-600" bgColor="bg-indigo-50" />
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search transactions by User, Asset or ID..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 px-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <FaFilter className="text-slate-400" />
                    <select
                        className="bg-transparent border-none outline-none py-4 font-black text-[10px] uppercase tracking-widest text-slate-600 cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Status: All</option>
                        <option value="confirmed">Settled</option>
                        <option value="pending">Processing</option>
                        <option value="cancelled">Refunded</option>
                    </select>
                </div>
            </div>

            {/* Ledger Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-8 py-6">Transaction ID</th>
                                <th className="px-8 py-6">Member / Identity</th>
                                <th className="px-8 py-6">Asset Source</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {filteredTransactions.map((tx, idx) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={tx.id}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">#{tx.id.slice(-8)}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-slate-900 uppercase text-sm leading-none mb-1">{tx.userName}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tx.method}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold text-slate-500 uppercase">{tx.carName}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-slate-900 tracking-tight text-lg">₹{tx.amount.toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                {new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <StatusBadge status={tx.status} />
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bgColor }) => (
    <div className={`p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all group`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const configs = {
        confirmed: { label: "Settled", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <FaCheckCircle /> },
        pending: { label: "Processing", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <FaClock /> },
        cancelled: { label: "Refunded", color: "text-rose-600 bg-rose-50 border-rose-100", icon: <FaTimesCircle /> },
    };

    const config = configs[status] || configs.pending;

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${config.color}`}>
            {config.icon}
            {config.label}
        </div>
    );
};

export default Payments;
