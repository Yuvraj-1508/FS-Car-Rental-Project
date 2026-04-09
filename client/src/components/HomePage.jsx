import React, { useState, useEffect } from 'react'
import Layout from './layout/Layout'
import { Link, useNavigate } from "react-router-dom";
import { FaCarSide, FaCar, FaUsers, FaCogs, FaMapMarkerAlt, FaQuoteLeft, FaStar, FaChevronRight, FaPlay, FaCheckCircle, FaRocket, FaHeadset, FaGem, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const HomePage = () => {
    const [stats, setStats] = useState({ cars: 0, clients: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [carsRes, usersRes] = await Promise.all([
                    axios.get(`${base_url}/api/cars`),
                    axios.get(`${base_url}/api/all/users`)
                ]);
                setStats({
                    cars: carsRes.data?.cars?.length || 0,
                    clients: usersRes.data?.totalUsers || 0
                });
            } catch (error) {
                console.error("Error fetching homepage stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <Layout>
            <div className="bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <HeroSection stats={stats} />
                <BestCars />
                <HowItWorks />
                <NewsLetter stats={stats} />
            </div>
        </Layout>
    )
}

const HeroSection = ({ stats }) => {
    const [location, setLocation] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        // Redirect to cars page with location and dates
        const query = new URLSearchParams();
        if (location) query.append("location", location);
        if (pickupDate) query.append("pickup", pickupDate);
        if (returnDate) query.append("return", returnDate);

        navigate(`/cars?${query.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Background Decorative Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]"></div>
                <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >


                        <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tighter">
                            Drive your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400">
                                dream today.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                            Experience the thrill of the open road with our exclusive fleet of luxury, sports, and classic vehicles. Book instantly.
                        </p>

                        <div className="flex flex-wrap items-center gap-8 pt-6">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.cars}+</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Premium Cars</span>
                            </div>
                            <div className="w-px h-12 bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.clients > 1000 ? (stats.clients / 1000).toFixed(1) + 'k' : stats.clients}+</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Happy Drivers</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl transform -translate-x-10"></div>
                        <img
                            src="/assets/hero.png"
                            alt="GoCar Fleet"
                            className="relative w-[120%] max-w-none h-auto object-contain transform -scale-x-100 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] -translate-y-10 -translate-x-10 transition-transform duration-700"
                        />
                    </motion.div>
                </div>

                {/* PREMIUM SEARCH BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-full max-w-5xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-3 md:p-4 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-white dark:border-slate-800 flex flex-col md:flex-row items-center gap-3"
                >
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative group px-6 py-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-300">
                            <FaMapMarkerAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-blue-600 transition-colors">
                                Pick-up Location
                            </label>
                            <input
                                type="text"
                                placeholder="City"
                                className="bg-transparent border-none outline-none w-full font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm md:text-base"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="relative group px-6 py-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-300">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-blue-600 transition-colors">
                                Pick-up Date
                            </label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="bg-transparent border-none outline-none w-full font-bold text-slate-900 dark:text-white cursor-pointer [color-scheme:light] dark:[color-scheme:dark] text-sm md:text-base"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                            />
                        </div>

                        <div className="relative group px-6 py-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-300">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-blue-600 transition-colors">
                                Return Date
                            </label>
                            <input
                                type="date"
                                min={pickupDate || new Date().toISOString().split('T')[0]}
                                className="bg-transparent border-none outline-none w-full font-bold text-slate-900 dark:text-white cursor-pointer [color-scheme:light] dark:[color-scheme:dark] text-sm md:text-base"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-full min-h-[72px] px-10 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 shrink-0 whitespace-nowrap shadow-lg"
                    >
                        Find Car
                        <FaArrowRight />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};




const BestCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/cars`);
            if (res.data?.success) {
                const activeCars = res.data.cars.filter(car => car.isAvailable !== false);
                setCars(activeCars.slice(0, 3));
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchCars(); }, []);

    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Featured <span className="text-blue-600">Vehicles</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Explore our curated selection of premium rides designed for comfort, performance, and ultimate satisfaction.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-[450px] bg-slate-200 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.map((car, index) => (
                            <motion.div
                                key={car._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="group bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-lg transition-all duration-500 flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden p-4 pb-0">
                                    <img src={car.carImage} alt={car.carName} className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 origin-bottom" />
                                    <div className="absolute top-8 right-8 z-20">
                                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{car.carYear}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 pt-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                                {car.carName}
                                            </h3>
                                            <div className="text-right shrink-0">
                                                <p className="text-xl font-black text-blue-600">₹{car.carRent.toLocaleString('en-IN')}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ day</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium mb-8 inline-flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {car.carCategory}
                                        </p>
                                    </div>

                                    <Link to={`/car/${car._id}`} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 dark:bg-slate-900 hover:bg-blue-600 border border-slate-100 dark:border-slate-800 hover:border-blue-600 text-slate-900 dark:text-white hover:text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300">
                                        View Details
                                        <FaArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        { icon: <FaMapMarkerAlt />, title: "Select Location", desc: "Find your ideal pickup point from our worldwide premium locations." },
        { icon: <FaCalendarAlt />, title: "Schedule Date", desc: "Select the perfect arrival and departure times for your journey." },
        { icon: <FaCar />, title: "Confirm Booking", desc: "Receive instant confirmation for your luxury vehicle of choice." }
    ];

    return (
        <section className="py-32 px-6 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Simple Process</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        How it <span className="text-blue-600">Works.</span>
                    </h2>
                </div>

                <div className="bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-3 gap-12 lg:gap-24">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative group"
                            >
                                {/* Step Connector Line */}
                                {i < 2 && (
                                    <div className="hidden lg:block absolute top-12 left-[60%] w-full h-px bg-slate-800 z-0 border-t border-dashed border-slate-700"></div>
                                )}

                                <div className="relative z-10 flex flex-col items-center lg:items-start">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500 text-4xl shadow-2xl mb-10 transition-colors duration-500">
                                        {step.icon}
                                    </div>
                                    <div className="text-center lg:text-left">
                                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                                            <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase tracking-tighter">Step 0{i + 1}</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-white mb-4 tracking-tight">
                                            {step.title}
                                        </h4>
                                        <p className="text-slate-400 font-medium leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const NewsLetter = ({ stats }) => {
    const [email, setEmail] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [randomContent, setRandomContent] = useState(null);
    const [subscribedEmail, setSubscribedEmail] = useState("");

    const rewards = [
        { type: "Exclusive Offer", title: "20% Discount Unlocked", desc: "Your elite status has been recognized. Use code 'GOPREMIUM' for your next booking.", icon: <FaGem className="text-amber-500" /> },
        { type: "Upcoming Alert", title: "New Fleet Arrival", desc: "5 New Lamborghini Aventadors are arriving next week. Be the first to pilot them.", icon: <FaRocket className="text-blue-500" /> },
        { type: "Strategic Update", title: "Regional Expansion", desc: "We've deployed new hubs in Mumbai and Bangalore. Luxury is now closer to you.", icon: <FaMapMarkerAlt className="text-emerald-500" /> },
        { type: "Member Reward", title: "Free Fuel Upgrade", desc: "Your subscription includes a one-time complimentary full-tank service.", icon: <FaCheckCircle className="text-rose-500" /> }
    ];

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                const res = await axios.post(`${base_url}/new/visiter`, { email });
                if (res.data.success) {
                    const random = rewards[Math.floor(Math.random() * rewards.length)];
                    setRandomContent(random);
                    setSubscribedEmail(email);
                    setShowSuccess(true);
                    setEmail("");
                } else {
                    toast.error(res.data.message || "Subscription failed");
                }
            } catch (error) {
                toast.error("Network error");
            }
        }
    };

    return (
        <section className="py-32 px-6 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] bg-slate-900 dark:bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col lg:flex-row"
                >
                    {/* Decorative Gradient Overlay */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10 pointer-events-none"></div>

                    {/* Branding Side */}
                    <div className="relative z-10 lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <FaRocket size={18} />
                            </div>
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Special Access</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                            The journey you’ve <br />
                            <span className="text-blue-500">always imagined.</span>
                        </h2>

                        <p className="text-slate-400 mb-10 max-w-md font-medium text-lg leading-relaxed">
                            Join our community of over 10,000 car enthusiasts and receive first-look access to our most exclusive luxury fleet additions.
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-white text-[10px] font-black`}>
                                        {i === 4 ? `${stats.clients > 1000 ? (stats.clients / 1000).toFixed(1) + 'k' : stats.clients}+` : <FaUsers size={12} className="opacity-50" />}
                                    </div>
                                ))}
                            </div>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Members</span>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="relative z-10 lg:w-1/2 p-12 md:p-16 lg:bg-slate-800/30 flex flex-col justify-center backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-slate-800">
                        <div className="bg-slate-900/50 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 shadow-inner">
                            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Stay in the Loop</h3>
                            <p className="text-slate-500 text-sm font-medium mb-8">Weekly car guides and exclusive seasonal discounts.</p>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-slate-700/50 text-white placeholder:text-slate-600 font-bold focus:bg-slate-800/80 focus:border-blue-500/50 transition-all outline-none text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-[0.98] shadow-xl shadow-blue-500/20"
                                >
                                    Subscribe To Newsletter
                                </button>
                            </form>
                            <p className="mt-6 text-[10px] text-slate-600 font-medium text-center uppercase tracking-widest opacity-50">
                                Unsubscribe at any time • Privacy Protected
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Success Reward Modal */}
            <AnimatePresence>
                {showSuccess && randomContent && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSuccess(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                                {randomContent.icon}
                            </div>

                            <div className="space-y-4 mb-10">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{randomContent.type}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{randomContent.title}</h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Subscription Verified For:</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{subscribedEmail}</p>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {randomContent.desc}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                            >
                                Acknowledge Protocol
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};



export default HomePage;
