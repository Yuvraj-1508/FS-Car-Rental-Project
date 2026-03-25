import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "./layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCreditCard, FaPaypal, FaLock, FaCheckCircle, FaChevronRight,
    FaCalendarAlt, FaGasPump, FaChair, FaCogs, FaMapMarkerAlt,
    FaShieldAlt, FaHistory, FaInfoCircle, FaStar
} from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const CarDetailsPage = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-blue-500/10 transition-colors duration-300">
                <BookCar />
            </div>
        </Layout>
    );
};

const BookCar = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCarDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/car/${id}`);
            if (res.data.success) {
                setCar(res.data.car);
            } else {
                toast.error(res.data?.message || "Fleet asset not found");
            }
        } catch (error) {
            toast.error("Network communication failure");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCarDetails();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Retrieving Asset Intel</p>
        </div>
    );

    if (!car) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center bg-white dark:bg-slate-950 transition-colors duration-300">
            <FaInfoCircle size={40} className="text-slate-200 dark:text-slate-800" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Asset Missing</h2>
            <p className="text-slate-400 max-w-xs uppercase text-[10px] font-bold leading-relaxed tracking-widest">The requested vehicle record does not exist in our secure fleet registry.</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
            {/* Header & Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-12 transition-colors duration-300"
            >
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100">
                            {car.carCategory}
                        </span>
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border ${car.isAvailable !== false
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}>
                            {car.isAvailable !== false ? "Asset Available" : "Asset Inactive"}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 transition-colors duration-300">
                        {car.carName}
                    </h1>
                    <div className="flex items-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <FaHistory className="text-blue-500/40" />
                            <span className="text-xs font-bold uppercase tracking-widest">Model {car.carYear}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-500/40" />
                            <span className="text-xs font-bold uppercase tracking-widest">{car.location}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Standard Daily Rate</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-300">
                        ₹{car.carRent.toLocaleString('en-IN')}
                        <span className="text-sm text-slate-400 font-bold tracking-widest ml-2 uppercase">/ Day</span>
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left: Visual Appreciation & Specs */}
                <div className="lg:col-span-8 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/3] sm:aspect-[16/11] shadow-2xl"
                    >
                        <img
                            src={car.carImage || "/placeholder.jpg"}
                            alt={car.carName}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                    </motion.div>

                    {/* Specification Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <SpecCard icon={<FaChair />} label="Capacity" value={`${car.carSeats} Persons`} />
                        <SpecCard icon={<FaGasPump />} label="Energy" value={car.carFuel} />
                        <SpecCard icon={<FaCogs />} label="Transmission" value={car.carGear} />
                        <SpecCard icon={<FaShieldAlt />} label="Protection" value="Premium Insured" />
                    </div>

                    {/* Description/About */}
                    <div className="p-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] relative overflow-hidden transition-colors duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.02] text-slate-900 dark:text-white">
                            <FaStar size={160} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase mb-6 flex items-center gap-3 transition-colors duration-300">
                            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                            Executive Summary
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium transition-colors duration-300">
                            Experience the pinnacle of automotive engineering with the {car.carName}.
                            Whether you're navigating urban landscapes or embarking on long-distance grand tours,
                            this {car.carCategory} provides unmatched presence, performance, and peace of mind
                            with our high-tier concierge insurance covering every mile.
                        </p>
                    </div>

                    {/* Review Section */}
                    <ReviewSection carId={car._id} />
                </div>

                {/* Right: Booking Interface */}
                <div className="lg:col-span-4 lg:sticky lg:top-32">
                    <BookingForm car={car} />
                </div>
            </div>
        </div>
    );
};

const ReviewSection = ({ carId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${base_url}/api/car-reviews/${carId}`);
                if (res.data.success) setReviews(res.data.reviews);
            } catch (error) {
                console.error("Reviews error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [carId]);

    const avg = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <div className="mt-16">
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <FaStar className="text-amber-500" /> Experiences
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">Asset Field Reports</p>
                </div>
                {reviews.length > 0 && (
                    <div className="text-right">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <FaStar key={i} size={12} className={i <= Math.round(avg) ? "text-amber-500" : "text-slate-200"} />
                            ))}
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{avg}</p>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-[2rem]"></div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="grid gap-6">
                    {reviews.map(r => (
                        <div key={r._id} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">{r.userId?.name?.charAt(0)}</div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{r.userId?.name}</span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => <FaStar key={i} size={10} className={i <= r.rating ? "text-amber-500" : "text-slate-200"} />)}
                                </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 italic text-sm font-medium leading-relaxed">"{r.comment}"</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Intelligence Data Available</p>
                </div>
            )}
        </div>
    );
};

const SpecCard = ({ icon, label, value }) => (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-500 group shadow-sm hover:shadow-md">
        <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
        <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest transition-colors duration-300">{value}</p>
    </div>
);

const BookingForm = ({ car }) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [hasBooked, setHasBooked] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const checkBookingStatus = async () => {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                setCheckingStatus(false);
                return;
            }

            try {
                const res = await axios.get(`${base_url}/api/myBooking`, {
                    headers: { Authorization: token }
                });

                if (res.data.success && res.data.result) {
                    const alreadyBooked = res.data.result.some(
                        (b) => b.carId._id === car._id && (b.status === "pending" || b.status === "confirmed")
                    );
                    setHasBooked(alreadyBooked);
                }
            } catch (error) {
                console.error("Booking check error:", error);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkBookingStatus();
    }, [car._id]);

    const calculateTotal = () => {
        if (!fromDate || !toDate) return 0;
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        return car.carRent * diffDays;
    };

    const handleNextToPayment = () => {
        if (!fromDate || !toDate) return toast.error("Deployment window required");
        if (new Date(toDate) < new Date(fromDate)) return toast.error("Timeline paradox: return before pickup");
        setStep(2);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/[^0-9]/gi, '').substring(0, 4);
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };
    const handleBooking = async () => {
        if (!cardNumber || !expiry || !cvv) {
            return toast.error("Card credentials required for decryption");
        }

        const token = localStorage.getItem("Authorization");
        if (!token) {
            toast.error("Unauthenticated. Please login.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create the Booking
            const bookingRes = await axios.post(
                `${base_url}/api/new/booking`,
                { carId: car._id, fromDate, toDate, status: "confirmed" },
                { headers: { Authorization: token } }
            );

            if (bookingRes.data.success) {
                const newBookingId = bookingRes.data.booking._id;
                const totalAmount = calculateTotal();

                // 2. Process and Save the Payment
                const paymentRes = await axios.post(
                    `${base_url}/api/process/payment`,
                    {
                        bookingId: newBookingId,
                        cardNumber: cardNumber.replace(/\s/g, ''),
                        expDate: expiry,
                        cvv: cvv,
                        amount: totalAmount
                    },
                    { headers: { Authorization: token } }
                );

                if (paymentRes.data.success) {
                    setStep(3);
                    toast.success("Transaction Secured");
                    setTimeout(() => navigate("/bookings"), 2500);
                } else {
                    toast.error("Payment sync failed");
                    setStep(1);
                }
            } else {
                toast.error(bookingRes.data.message);
                setStep(1);
            }
        } catch (error) {
            console.error("Deployment failed:", error);
            toast.error(error.response?.data?.message || "Deployment failed. Retry.");
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex justify-center items-center min-h-[400px] transition-colors duration-300">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (hasBooked) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center text-center justify-center min-h-[400px] transition-colors duration-300">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <FaCheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 transition-colors duration-300">Already Booked</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide leading-relaxed max-w-[250px] mb-8 transition-colors duration-300">
                    You already have an active reservation for this specific vehicle in your fleet.
                </p>
                <button
                    onClick={() => navigate('/bookings')}
                    className="w-full py-5 bg-blue-600 hover:bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    Manage Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-3 transition-colors duration-300">
                                <FaCalendarAlt className="text-blue-600" />
                                Reservation
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select your deployment window</p>
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-600 transition-colors">Capture Date</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-blue-400/50 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-400/5 transition-all outline-none text-slate-800 dark:text-white font-bold [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>

                            <div className="group">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-600 transition-colors">Return Date</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    min={fromDate || new Date().toISOString().split("T")[0]}
                                    className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-blue-400/50 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-400/5 transition-all outline-none text-slate-800 dark:text-white font-bold [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Total Investment</p>
                                    <p className="text-3xl font-black text-blue-600 tracking-tighter">
                                        ₹{calculateTotal().toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-50">Incl. VAT & Insurance</p>
                            </div>
                            <button
                                onClick={handleNextToPayment}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                Secure Deployment <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3 transition-colors duration-300">
                                <FaCreditCard className="text-emerald-600" />
                                Payment
                            </h3>
                            <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-blue-600">Amend Dates</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-3xl border-2 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/10 flex flex-col items-center gap-3 cursor-pointer group hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                <FaCreditCard className="text-3xl text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-500">Secured Card</span>
                            </div>
                            {/* <div className="p-5 rounded-3xl border-2 border-slate-100 bg-slate-50 flex flex-col items-center gap-3 opacity-30 cursor-not-allowed grayscale">
                                <FaPaypal className="text-3xl text-slate-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Global UPI</span>
                            </div> */}
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-emerald-600 transition-colors">Card Signature</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength="19"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        className="w-full p-4 pl-12 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold focus:border-emerald-400/50 dark:focus:border-emerald-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    />
                                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-emerald-600">Exp.</label>
                                    <input
                                        type="text"
                                        maxLength="5"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold focus:border-emerald-400/50 dark:focus:border-emerald-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-emerald-600">CVV</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            maxLength="3"
                                            placeholder="•••"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold focus:border-emerald-400/50 dark:focus:border-emerald-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all tracking-[0.3em] font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
                                <FaLock className="text-emerald-600/50" size={12} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">AES-256 Bit Encryption Protocol Active</p>
                            </div>
                            <button
                                onClick={handleBooking}
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-[0.98] ${loading
                                    ? 'bg-slate-200 text-slate-400 cursor-wait'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Processing Transaction
                                    </span>
                                ) : (
                                    <>Finalize ₹{calculateTotal().toLocaleString('en-IN')}</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-sm border border-emerald-100">
                            <FaCheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-2">Asset Secured</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
                            Transaction successfully synchronized.<br />
                            Retrieving your digital access keys...
                        </p>
                        <div className="mt-10 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.5 }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarDetailsPage;
