import Swal from 'sweetalert2';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaTrash, FaSync, FaEnvelope, FaClock } from 'react-icons/fa';
import Loader from '../../Loader';

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const Visiter = () => {
    const [visiter, setVisiter] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllvisiter = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/all/visiter`);
            if (res.data.success) {
                setVisiter(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching visitors:", error.message);
            toast.error("Failed to load visitor insights");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Permanent Deletion',
            text: "Are you sure you want to remove this record from the traffic logs?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb', // Matches your blue-600
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, Decommission',
            cancelButtonText: 'Abort Request',
            background: '#ffffff',
            borderRadius: '2rem',
            customClass: {
                popup: 'rounded-[2rem] border border-slate-100 shadow-2xl',
                title: 'font-black uppercase tracking-tighter text-slate-900',
                htmlContainer: 'font-medium text-slate-500',
                confirmButton: 'rounded-xl font-black uppercase text-[10px] tracking-widest px-8 py-4',
                cancelButton: 'rounded-xl font-black uppercase text-[10px] tracking-widest px-8 py-4'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${base_url}/remove/visiter/${id}`);
                    if (res.data.success) {
                        Swal.fire({
                            title: 'Decommissioned',
                            text: 'The visitor intelligence record has been purged.',
                            icon: 'success',
                            background: '#ffffff',
                            borderRadius: '2rem',
                            confirmButtonColor: '#2563eb'
                        });
                        getAllvisiter();
                    }
                } catch (error) {
                    console.error("Error deleting visitor:", error.message);
                    toast.error("Process Failed: " + error.message);
                }
            }
        });
    };

    useEffect(() => {
        getAllvisiter();
    }, []);

    if (loading && visiter.length === 0) return (
        <div className="p-8 space-y-8 animate-pulse bg-white min-h-screen">
            <div className="h-10 bg-slate-100 rounded-lg w-48"></div>
            <div className="h-64 bg-slate-100 rounded-3xl"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-slate-900 p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FaEye className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Analytics Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-uppercase">TRAFFIC <span className="text-blue-600 italic">LOGS</span></h1>
                    <p className="text-slate-500 mt-1 max-w-md font-medium">Monitoring site engagement and unique visitor footprints across the platform.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-center shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-2">Total Hits</p>
                        <p className="text-2xl font-black text-slate-900">{visiter.length}</p>
                    </div>
                    <button
                        onClick={getAllvisiter}
                        className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                        title="Sync Intelligence"
                    >Refresh

                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6 text-uppercase">Intelligence Header (Email)</th>
                                <th className="px-10 py-6 text-center text-uppercase">Timestamp Captured</th>
                                <th className="px-10 py-6 text-right text-uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {visiter.length > 0 ? (
                                    visiter.map((user, index) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.03 }}
                                            key={user._id}
                                            className="group hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <FaEnvelope size={14} />
                                                    </div>
                                                    <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
                                                    <FaClock size={10} className="text-blue-500/50" />
                                                    {new Date(user.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <button
                                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    onClick={() => handleDelete(user._id)}
                                                    title="Decommission Record"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center opacity-30">
                                                <FaEye size={60} className="mb-4 text-slate-400" />
                                                <h3 className="text-xl font-black uppercase tracking-widest text-slate-500">Zero Intel Captured</h3>
                                                <p className="text-sm font-medium mt-2 text-slate-500">The system has not logged any unique visitors yet.</p>
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
    )
}

export default Visiter