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

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <SpecCard icon={<FaChair />} label="Capacity" value={`${car.carSeats} Persons`} />
                        <SpecCard icon={<FaGasPump />} label="Energy" value={car.carFuel} />
                        <SpecCard icon={<FaCogs />} label="Transmission" value={car.carGear} />
                        <SpecCard icon={<FaShieldAlt />} label="Protection" value="Premium Insured" />
                    </div>

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

                    <ReviewSection carId={car._id} />
                </div>

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
    const [existingBookings, setExistingBookings] = useState([]);
    const [isOverlapping, setIsOverlapping] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("now");
    const navigate = useNavigate();

    const getDaysUntilPickup = () => {
        if (!fromDate) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        const diffTime = start - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    useEffect(() => {
        if (getDaysUntilPickup() < 4) {
            setPaymentMethod("now");
        }
    }, [fromDate]);

    // Fetch existing bookings to check for overlap
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${base_url}/api/all/booking`, {
                    headers: { Authorization: localStorage.getItem("Authorization") }
                });
                if (res.data.success) {
                    const carBookings = res.data.bookings.filter(
                        (b) => b.carId._id === car._id && (b.status === "confirmed" || b.status === "pending")
                    );
                    setExistingBookings(carBookings);
                }
            } catch (err) {
                console.error("Failed to fetch fleet schedule");
            }
        };
        if (car?._id) fetchBookings();
    }, [car._id]);

    // Dynamic overlap detection
    useEffect(() => {
        if (!fromDate || !toDate) {
            setIsOverlapping(false);
            return;
        }

        // The inputs provide YYYY-MM-DD. We compare them directly as strings with the server dates
        // to avoid timezone/DST shifts that new Date() can introduce.
        const startStr = fromDate;
        const endStr = toDate;

        const overlap = existingBookings.some((b) => {
            const bStartStr = b.fromDate.split('T')[0];
            const bEndStr = b.toDate.split('T')[0];

            // Standard overlap logic: (StartA <= EndB) and (EndA >= StartB)
            return startStr <= bEndStr && endStr >= bStartStr;
        });

        setIsOverlapping(overlap);
    }, [fromDate, toDate, existingBookings]);

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
        if (isOverlapping) return;

        if (paymentMethod === "later") {
            handleBooking();
        } else {
            setStep(2);
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

    const handleBooking = async () => {
        if (paymentMethod === "now" && (!cardNumber || !expiry || !cvv)) return toast.error("Card credentials required");
        const token = localStorage.getItem("Authorization");
        if (!token) return toast.error("Session expired. Please login.");

        setLoading(true);
        try {
            const bookingRes = await axios.post(`${base_url}/api/new/booking`,
                {
                    carId: car._id,
                    fromDate,
                    toDate,
                    status: paymentMethod === "later" ? "pending" : "confirmed"
                },
                { headers: { Authorization: token } }
            );

            if (bookingRes.data.success) {
                const totalAmount = calculateTotal();

                if (paymentMethod === "now") {
                    await axios.post(`${base_url}/api/process/payment`, {
                        bookingId: bookingRes.data.booking._id,
                        cardNumber: cardNumber.replace(/\s/g, ''),
                        expDate: expiry,
                        cvv: cvv,
                        amount: totalAmount
                    }, { headers: { Authorization: token } });
                }

                setStep(3);
                toast.success(paymentMethod === "now" ? "Transaction Secured" : "Reservation Confirmed (Pay Later)");
                setTimeout(() => navigate("/bookings"), 2500);
            } else {
                toast.error(bookingRes.data.message);
                setStep(1);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Deployment failed");
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <AnimatePresence mode="wait">
                {isOverlapping ? (
                    <motion.div
                        key="overlap"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-10 flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mb-6">
                            <FaInfoCircle size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Already Booked</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide leading-relaxed max-w-[250px] mb-8">
                            This vehicle is reserved for the selected timeline. Please adjust your dates.
                        </p>
                        <button onClick={() => { setFromDate(""); setToDate(""); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Reset Timeline</button>
                    </motion.div>
                ) : step === 1 && (
                    <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-3">
                                <FaCalendarAlt className="text-blue-600" /> Reservation
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select your deployment window</p>
                        </div>
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-600 transition-colors">Capture Date</label>
                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                            </div>
                            <div className="group">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-600 transition-colors">Return Date</label>
                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} min={fromDate || new Date().toISOString().split("T")[0]} className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            {getDaysUntilPickup() >= 4 && (
                                <div className="space-y-3 mb-8">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Payment Schedule</label>
                                    <div className="flex p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => setPaymentMethod("now")}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === "now" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
                                        >
                                            Pay Now
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("later")}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === "later" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
                                        >
                                            Pay After
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Total Amount</p>
                                    <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{calculateTotal().toLocaleString('en-IN')}</p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-50">Incl. TAX & Insurance</p>
                            </div>
                            <button onClick={handleNextToPayment} disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3">
                                {loading ? "Initializing..." : paymentMethod === "now" ? "Secure Deployment" : "Confirm Reservation"} <FaChevronRight />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                <FaCreditCard className="text-emerald-600" /> Payment
                            </h3>
                            <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest underline underline-offset-4">Amend Dates</button>
                        </div>
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Card Signature</label>
                                <input type="text" maxLength="19" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" maxLength="5" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold outline-none" />
                                <input type="password" maxLength="3" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))} className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold outline-none tracking-widest" />
                            </div>
                        </div>
                        <button onClick={handleBooking} disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all">
                            {loading ? "Processing..." : `Finalize ₹${calculateTotal().toLocaleString('en-IN')}`}
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 border border-emerald-100">
                            <FaCheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-2">Asset Secured</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Transaction successfully synchronized.</p>
                        <div className="mt-10 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} className="h-full bg-emerald-500" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarDetailsPage;
