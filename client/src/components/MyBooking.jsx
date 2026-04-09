import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./layout/Layout";
import { FaCalendarAlt, FaMapMarkerAlt, FaCar, FaClock, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaGasPump, FaCogs, FaChevronRight, FaStar, FaCreditCard, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const MyBooking = () => {
    return (
        <Layout>
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    html, body { 
                        height: 100% !important; 
                        max-height: 100% !important;
                        overflow: hidden !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Aggressive hiding of any element NOT leading to the invoice */
                    body > :not(#root),
                    #root > :not(main),
                    main > :not(.booking-list-area),
                    .booking-list-area > :not(#booking-order-root),
                    #booking-order-root > :not(#invoice-print-area) {
                        display: none !important;
                        height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }

                    #invoice-print-area {
                        display: block !important;
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: white !important;
                        z-index: 99999 !important;
                    }
                    
                    .invoice-modal-wrapper {
                        position: static !important;
                        display: block !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    
                    .invoice-content { 
                        display: block !important;
                        width: 100% !important;
                        max-width: none !important;
                        height: auto !important;
                        border: none !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        background: white !important;
                        margin: 0 !important;
                    }
                    
                    .invoice-content > .invoice-scroll-container { 
                        max-height: none !important; 
                        overflow: visible !important; 
                        padding: 10mm !important; 
                    }
                    
                    .dark .invoice-content { background: white !important; color: black !important; }
                    .dark .invoice-content * { color: black !important; border-color: #eee !important; background-color: transparent !important; }

                    /* Aggressive spacing reduction for 1-page guarantee */
                    .invoice-content .space-y-10 { gap: 10px !important; }
                    .invoice-content .space-y-8 { gap: 8px !important; }
                    .invoice-content .p-10, .invoice-content .p-14 { padding: 5mm !important; }
                    .invoice-content .pb-8, .invoice-content .pb-10 { padding-bottom: 2mm !important; }
                    .invoice-content .pt-6, .invoice-content .pt-10 { padding-top: 2mm !important; }
                    .invoice-content .mb-10, .invoice-content .mb-8 { margin-bottom: 2mm !important; }
                    .invoice-content .mt-10 { margin-top: 2mm !important; }
                    .invoice-content h1 { font-size: 20pt !important; margin-bottom: 0 !important; }
                    .invoice-content p, .invoice-content span { font-size: 9pt !important; }
                    .invoice-content .text-xl { font-size: 11pt !important; }
                    .invoice-content .text-4xl { font-size: 18pt !important; }
                    .invoice-content .w-16.h-12 { width: 40px !important; height: 30px !important; }
                    .invoice-content table td, .invoice-content table th { padding: 2mm 4mm !important; }
                    .invoice-content .rounded-[2rem], .invoice-content .rounded-[3rem] { border-radius: 1rem !important; }
                }
            `}</style>
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen booking-list-area">
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
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("active");
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewingBooking, setReviewingBooking] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Payment States
    const [payingBooking, setPayingBooking] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);

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
                headers: { Authorization: token },
            });

            const fetched = (res.data.result || []).sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
            setAllBookings(fetched);
            filterBookings(fetched, activeTab);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
            toast.error("Error loading bookings");
        } finally {
            setLoading(false);
        }
    };

    const isFinished = (toDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setHours(0, 0, 0, 0);
        return end < today;
    };

    const isCancellable = (fromDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        return today < start;
    };

    const filterBookings = (list, tab) => {
        const filtered = list.filter((b) => {
            const finished = isFinished(b.toDate);
            return tab === "active" ? !finished : finished;
        });
        setBookings(filtered);
    };

    useEffect(() => {
        filterBookings(allBookings, activeTab);
    }, [activeTab, allBookings]);

    const handleCancelBooking = async (id, fromDate) => {
        if (!isCancellable(fromDate)) {
            toast.error("Cancellation protocol closed. You cannot cancel on or after the pickup date.");
            return;
        }

        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const token = localStorage.getItem("Authorization");
            const res = await axios.put(`${base_url}/api/all/booking/${id}`,
                { status: "cancelled" },
                { headers: { Authorization: token } }
            );
            if (res.data.success) {
                toast.success("Booking cancelled successfully");
                setAllBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
            }
        } catch (err) {
            toast.error("Failed to cancel booking");
        }
    };

    const handleReviewSubmit = async () => {
        if (!reviewComment) return toast.error("Field notes required");
        setSubmittingReview(true);
        try {
            const token = localStorage.getItem("Authorization");
            await axios.post(`${base_url}/api/new-review`, {
                carId: reviewingBooking.carId._id,
                bookingId: reviewingBooking._id,
                rating: reviewRating,
                comment: reviewComment
            }, { headers: { Authorization: token } });

            toast.success("Intelligence filed successfully");
            setShowReviewModal(false);
            setReviewComment("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Filing failed");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleProcessPayNow = async () => {
        if (!cardNumber || !expiry || !cvv) return toast.error("Card credentials required");
        setProcessingPayment(true);
        try {
            const token = localStorage.getItem("Authorization");
            const res = await axios.post(`${base_url}/api/process/payment`, {
                bookingId: payingBooking._id,
                cardNumber: cardNumber.replace(/\s/g, ''),
                expDate: expiry,
                cvv: cvv,
                amount: payingBooking.TotalPay
            }, { headers: { Authorization: token } });

            if (res.data.success) {
                await axios.put(`${base_url}/api/all/booking/${payingBooking._id}`,
                    { status: "confirmed" },
                    { headers: { Authorization: token } }
                );

                toast.success("Transaction Secured. Booking confirmed.");
                setAllBookings(prev => prev.map(b => b._id === payingBooking._id ? { ...b, status: 'confirmed' } : b));
                setShowPayModal(false);
                setPayingBooking(null);
            }
        } catch (err) {
            toast.error("Payment sync failed");
        } finally {
            setProcessingPayment(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(' ').substring(0, 19);
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length <= 2) return v;
        return v.substring(0, 2) + '/' + v.substring(2, 4);
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
        <div id="booking-order-root">
            {/* Wrapper for content to hide during print */}
            <div className="py-16 px-6 max-w-5xl mx-auto" id="main-page-content">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    My <span className="text-blue-600">Bookings</span>
                </h1>

            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-16 px-4">
                <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-inner">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-8 md:px-12 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === "active"
                            ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl shadow-blue-500/5 translate-y-[-1px]"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                    >
                        Active Car
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-8 md:px-12 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === "history"
                            ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl shadow-blue-500/5 translate-y-[-1px]"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                    >
                        Booking History
                    </button>
                </div>
            </div>

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
                                            <span className={`text-[9px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full inline-block ${booking.status === 'confirmed'
                                                ? 'text-[#00A65A] dark:text-emerald-400 bg-[#E8F8F0] dark:bg-emerald-900/20'
                                                : booking.status === 'pending'
                                                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                                                    : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'Payment Success' : booking.status === 'pending' ? 'Pay After (In Person)' : 'Booking Cancelled'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-8 lg:mt-0 w-full lg:w-auto justify-end">
                                        {activeTab === 'history' && !booking.isCarReviewed && (
                                            <button
                                                onClick={() => { setReviewingBooking(booking); setShowReviewModal(true); }}
                                                className="flex items-center gap-2 px-6 py-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-600 hover:text-white rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group/review"
                                            >
                                                <FaStar size={14} className="group-hover/review:rotate-[360deg] transition-transform duration-500" />
                                                <span>Share Intel</span>
                                            </button>
                                        )}
                                        {activeTab === 'active' && (booking.status === 'pending' || booking.status === 'confirmed') && (
                                            <>
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => { setPayingBooking(booking); setShowPayModal(true); }}
                                                        className="flex items-center gap-2 px-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group/pay"
                                                    >
                                                        <FaCreditCard size={14} />
                                                        <span>Payment</span>
                                                    </button>
                                                )}
                                                {isCancellable(booking.fromDate) && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id, booking.fromDate)}
                                                        className="flex items-center gap-2 px-6 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group/cancel"
                                                        title="Cancel Booking"
                                                    >
                                                        <FaTimesCircle className="group-hover/cancel:rotate-90 transition-transform" size={14} />
                                                        <span>Cancel Booking</span>
                                                    </button>
                                                )}
                                            </>
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
            </div>

            {/* Details & Invoice Modal - Professional Protocol */}
            <div id="invoice-print-area">
            <AnimatePresence>
                {showModal && selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 invoice-modal-wrapper">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 invoice-content flex flex-col max-h-[90vh]"
                        >
                            {/* Scrollable Content Container */}
                            <div className="overflow-y-auto custom-scrollbar p-10 md:p-14 invoice-scroll-container">
                                {/* Invoice Content */}
                                <div className="space-y-10">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 pb-8 gap-6">
                                        <div>
                                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">TAX <span className="text-blue-600">INVOICE</span></h1>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">LX Rental Services • Official Receipt</p>
                                        </div>
                                        <div className="text-left md:text-right space-y-1">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Number</span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white uppercase">#INV-{selectedBooking._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Issue</span>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(selectedBooking.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billing Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Billed To</h4>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedBooking.userId?.name || "Valued Customer"}</p>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{selectedBooking.userId?.email || "customer@example.com"}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{selectedBooking.carId?.location || "Surat, Gujarat"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 md:text-right">
                                            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Operational Hub</h4>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black text-slate-900 dark:text-white">LX Rental Hub</p>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Main Square Road, Premium Wing</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">GSTIN: 24AAACR1234A1Z1</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Asset Details Table */}
                                    <div className="border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Item</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Impact</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-12 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5 flex-shrink-0">
                                                                <img src={selectedBooking.carId?.carImage} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedBooking.carId?.carName}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedBooking.carId?.carCategory} • {selectedBooking.carId?.carFuel} • {selectedBooking.carId?.carGear}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                                                            {Math.ceil((new Date(selectedBooking.toDate) - new Date(selectedBooking.fromDate)) / (1000 * 60 * 60 * 24)) + 1} Days
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rental Period</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <p className="text-lg font-black text-blue-600 tracking-tight">₹{selectedBooking.TotalPay}</p>
                                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">Paid</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Deployment Window Context */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <FaCalendarAlt size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pickup Execution</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{new Date(selectedBooking.fromDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                                            <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                                <FaMapMarkerAlt size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Return Protocol</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{new Date(selectedBooking.toDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Seal */}
                                    <div className="pt-6 border-t-2 border-dashed border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/10 px-6 py-3 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Transaction Verified & Sealed</span>
                                            </div>
                                            <div className="text-center md:text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total (Inclusive of all taxes)</p>
                                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">₹{selectedBooking.TotalPay}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 no-print">
                                        <button
                                            onClick={() => window.print()}
                                            className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                                        >
                                            Download PDF Protocol
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Submission Modal - New Intelligence Report */}
            <AnimatePresence>
                {showReviewModal && reviewingBooking && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReviewModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <FaStar size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Share Mission Intel</h3>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3">Asset: {reviewingBooking.carId?.carName}</p>
                            </div>

                            <div className="space-y-10">
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <button
                                            key={i}
                                            onClick={() => setReviewRating(i)}
                                            className={`transition-all duration-300 transform active:scale-95 ${reviewRating >= i ? "text-amber-500 scale-125" : "text-slate-100 dark:text-slate-800"}`}
                                        >
                                            <FaStar size={36} />
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Deployment Field Notes</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Describe the vehicle performance, comfort, and logistics..."
                                        rows={4}
                                        className="w-full p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-sm font-medium text-slate-700 dark:text-slate-200 focus:border-blue-500/50 outline-none transition-all resize-none shadow-inner"
                                    />
                                </div>

                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={submittingReview}
                                    className="w-full py-5 bg-slate-950 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {submittingReview ? "Archiving Signal..." : "Submit Experience Intel"}
                                </button>

                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                                >
                                    Abort Operation
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Pay Now Modal - Secure Settlement Protocol */}
            <AnimatePresence>
                {showPayModal && payingBooking && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPayModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800"
                        >
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <FaCreditCard size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Payment</h3>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3">Grand Total: ₹{payingBooking.TotalPay}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Card Signature</label>
                                    <input
                                        type="text"
                                        maxLength="19"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Expiry</label>
                                        <input
                                            type="text"
                                            maxLength="5"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">CVV</label>
                                        <input
                                            type="password"
                                            maxLength="3"
                                            placeholder="•••"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500/50 tracking-widest transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center gap-4 border border-blue-100 dark:border-blue-800/30">
                                    <FaLock className="text-blue-600" size={16} />
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-relaxed">Your transaction is encrypted with 256-bit AES protocols for maximum security.</p>
                                </div>

                                <button
                                    onClick={handleProcessPayNow}
                                    disabled={processingPayment}
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {processingPayment ? "Synchronizing..." : `Finalize ₹${payingBooking.TotalPay}`}
                                </button>

                                <button
                                    onClick={() => setShowPayModal(false)}
                                    className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
};

export default MyBooking;
