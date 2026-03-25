import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./layout/Layout";
import { FaCalendarAlt, FaMapMarkerAlt, FaCar, FaClock, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaGasPump, FaCogs, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const MyBooking = () => {
    return (
        <Layout>
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                <BookingOrder />
            </div>
        </Layout>
    );
};

const statusConfig = {
    pending: { color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", badgeColor: "text-amber-600 bg-amber-50 dark:bg-amber-900/40", icon: <FaClock /> },
    confirmed: { color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800", badgeColor: "text-[#00A65A] bg-[#E8F8F0] dark:bg-emerald-900/40", icon: <FaCheckCircle /> },
    cancelled: { color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800", badgeColor: "text-rose-600 bg-rose-50 dark:bg-rose-900/40", icon: <FaTimesCircle /> },
};

const BookingOrder = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const getBookings = async () => {
        const token = localStorage.getItem("Authorization");
        if (!token) {
            setError("Authentication required to view your bookings.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/myBooking`, {
                headers: {
                    Authorization: token,
                },
            });
            const sortedBookings = (res.data.result || []).sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
            setBookings(sortedBookings);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
            toast.error("Error loading bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const token = localStorage.getItem("Authorization");
            const res = await axios.put(`${base_url}/api/all/booking/${id}`, 
                { status: "cancelled" },
                { headers: { Authorization: token } }
            );
            if (res.data.success) {
                toast.success("Booking cancelled successfully");
                setBookings((prev) => 
                    prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b)
                );
            }
        } catch (err) {
            console.error("Error cancelling booking:", err);
            toast.error("Failed to cancel booking");
        }
    };

    useEffect(() => {
        getBookings();
    }, []);

    if (loading) return (
        <div className="max-w-5xl mx-auto px-6 py-20 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48 mx-auto mb-12"></div>
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center space-y-8">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                <div className="relative p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-blue-600 shadow-xl">
                    <FaClock size={48} className="animate-pulse" />
                </div>
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Access Restricted</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">{error}</p>
            </div>
            <Link to="/" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/20">
                Return to Home
            </Link>
        </div>
    );

    return (
        <div className="py-16 px-6 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <br /><br />

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    My <span className="text-blue-600">Bookings</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">
                    Manage your upcoming journeys and review past rentals.
                </p>
            </motion.div>

            {/* List */}
            <div className="space-y-10">
                <AnimatePresence mode="popLayout">
                    {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                            <motion.div
                                layout
                                key={booking._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-4 flex flex-col lg:flex-row gap-6 lg:gap-10 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500"
                            >
                                {/* Car Image Area */}
                                <div className="lg:w-[380px] lg:h-[260px] h-[220px] bg-slate-100 dark:bg-slate-800 rounded-[2rem] relative overflow-hidden flex-shrink-0 group">
                                    <img
                                        src={booking.carId?.carImage}
                                        alt={booking.carId?.carName}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${statusConfig[booking.status]?.badgeColor || "text-emerald-500 bg-emerald-50"}`}>
                                            {statusConfig[booking.status]?.icon}
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 flex flex-col py-2 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] sm:text-xs font-black text-slate-400 tracking-widest uppercase">Booking #{booking._id.slice(-6)}</span>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                            <span className="text-[10px] sm:text-xs font-black text-blue-600 tracking-widest uppercase">{new Date(booking.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                            {booking.carId?.carName}
                                        </h3>
                                        <p className="text-slate-400 font-bold text-[11px] sm:text-xs uppercase tracking-widest">
                                            {booking.carId?.carCategory} · {booking.carId?.carYear} Model
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-6 mt-6 border-t border-slate-50 dark:border-slate-800">
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 lg:pl-[60px]">Rental Window</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 text-white rounded-[14px] flex items-center justify-center shadow-md shadow-blue-500/20">
                                                    <FaCalendarAlt size={16} />
                                                </div>
                                                <div className="bg-[#F0F5FF] dark:bg-slate-800 px-5 py-3 rounded-xl border border-blue-50 dark:border-slate-700">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                                        {new Date(booking.fromDate).toLocaleDateString("en-GB")} — {new Date(booking.toDate).toLocaleDateString("en-GB")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 lg:pl-[60px]">Handover Point</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-[14px] flex items-center justify-center">
                                                    <FaMapMarkerAlt size={16} />
                                                </div>
                                                <div className="py-3 pr-5">
                                                    <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300">
                                                        {booking.carId?.location || "Surat"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Action Side */}
                                <div className="flex flex-col justify-between items-end lg:min-w-[190px] py-2 lg:pl-6 pt-6 lg:pt-2 border-t lg:border-t-0 border-slate-50 dark:border-slate-800">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Total Impact</p>
                                        <p className="text-[40px] leading-none font-black text-blue-600 tracking-tighter">₹{booking.TotalPay}</p>
                                        <div className="mt-4 flex justify-end">
                                            <span className="text-[9px] text-[#00A65A] dark:text-emerald-400 font-black uppercase tracking-wider bg-[#E8F8F0] dark:bg-emerald-900/20 px-4 py-1.5 rounded-full inline-block">Payment Success</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-8 lg:mt-0 w-full lg:w-auto justify-end">
                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="flex items-center gap-2 px-6 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group/cancel"
                                                title="Cancel Booking"
                                            >
                                                <FaTimesCircle className="group-hover/cancel:rotate-90 transition-transform" size={14} /> 
                                                <span>Cancel Booking</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                                            className="w-full lg:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-[14px] hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all group/btn active:scale-95 shadow-lg shadow-slate-900/20 dark:shadow-none"
                                        >
                                            View Details <FaChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 space-y-6"
                        >
                            <div className="text-8xl mb-4 opacity-20">🎫</div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Start Your First Story</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">You haven't booked any vehicles yet. Explore our fleet and find your next drive.</p>
                            <Link to="/cars" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                                Browse Vehicles
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Details & Invoice Modal */}
            <AnimatePresence>
                {showModal && selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-800 invoice-content flex flex-col"
                        >
                            {/* Scrollable Content Container */}
                            <div className="max-h-[85vh] overflow-y-auto scrollbar-hide">
                                <div className="p-8 md:p-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                                    <FaCar size={12} />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Official Invoice</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Booking Summary</h2>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">ID: #{selectedBooking._id.toUpperCase()}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors no-print"
                                        >
                                            <FaTimesCircle size={22} className="text-slate-300 hover:text-rose-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Asset Details - More Compact */}
                                        <div className="flex items-center gap-6 p-5 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                            <div className="w-24 h-20 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
                                                <img src={selectedBooking.carId?.carImage} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{selectedBooking.carId?.carName}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                                                        <FaGasPump size={8} className="text-blue-500" /> {selectedBooking.carId?.carFuel}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                                                        <FaCogs size={8} className="text-indigo-500" /> {selectedBooking.carId?.carGear}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Logistics Grid - Optimized Spacing */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-1">
                                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-l-2 border-blue-600 pl-3">Rental Window</p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Pickup</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                            {new Date(selectedBooking.fromDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Handover</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                            {new Date(selectedBooking.toDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-l-2 border-rose-500 pl-3">Pickup Location</p>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Base Region</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{selectedBooking.carId?.location}</p>
                                                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-[10px] text-slate-500 font-medium italic">
                                                        "Vehicle will be waiting at our partner hub."
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial Breakdown - Refined Height */}
                                        <div className="pt-4">
                                            <div className="flex justify-between items-center bg-blue-600 p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                                                <div className="relative z-10">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Impact</p>
                                                    <p className="text-[10px] font-medium opacity-70">Paid & Verified</p>
                                                </div>
                                                <div className="relative z-10 text-right">
                                                    <p className="text-4xl font-black tracking-tighter italic">₹{selectedBooking.TotalPay}</p>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full mt-2 inline-block backdrop-blur-md">Settled Digitally</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.print()}
                                        className="w-full mt-8 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 transition-all active:scale-95 no-print"
                                    >
                                        Download Official Receipt
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyBooking;
