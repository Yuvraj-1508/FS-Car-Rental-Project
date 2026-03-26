import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaCar, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaUserShield, FaTimes, FaGoogle, FaArrowRight } from "react-icons/fa";
import { MdOutlineBookmarkAdded, MdLogin, MdClose, MdDashboard } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../Loader";
import { motion, AnimatePresence } from "framer-motion";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [welcomeName, setWelcomeName] = useState("");
    const [pendingRedirect, setPendingRedirect] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sbookings, setSBookings] = useState([]);
    const [scrolled, setScrolled] = useState(false);




    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = async (val) => {
        setSearch(val)
        if (!val) {
            setSBookings([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${base_url}/api/search/?q=${val}`);
            if (res.data?.success) {
                setSBookings(res.data.data);
            }
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedName = localStorage.getItem("UserName");
        const storedRole = localStorage.getItem("UserRole");
        if (storedName) setWelcomeName(storedName);
        if (storedRole) setRole(parseInt(storedRole));
    }, []);

    const Login = async () => {
        try {
            if (!email || !password) {
                toast.error("Email & Password are required");
                return;
            }
            setLoading(true);
            const res = await axios.post(`${base_url}/api/login`, { email, password });

            if (res.data?.success) {
                toast.success(res.data.message || "Login successful!");
                setIsModalOpen(false);
                const token = res?.data?.token;
                localStorage.setItem("Authorization", `Bearer ${token}`);
                localStorage.setItem("UserName", res.data.name);
                localStorage.setItem("UserRole", String(res.data.role));
                setWelcomeName(res.data.name);
                const roleNum = parseInt(res.data.role);
                setRole(roleNum);
                const targetPath = roleNum === 1 ? "/admin" : (pendingRedirect || "/");
                setPendingRedirect(null);
                navigate(targetPath);
            } else {
                toast.error(res.data?.message || "Error while login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const Register = async () => {
        try {
            if (!name || !email || !password) {
                toast.error("Name, Email & Password are required");
                return;
            }
            setLoading(true);
            const res = await axios.post(`${base_url}/api/register`, { name, email, password });

            if (res.data?.success) {
                toast.success(res.data.message || "Registration successful!");
                const token = res?.data?.token;
                if (token) {
                    localStorage.setItem("Authorization", `Bearer ${token}`);
                    localStorage.setItem("UserName", res.data.name);
                    localStorage.setItem("UserRole", String(res.data.role));
                    setWelcomeName(res.data.name);
                    const roleNum = parseInt(res.data.role);
                    setRole(roleNum);
                    const targetPath = roleNum === 1 ? "/admin" : (pendingRedirect || "/");
                    setPendingRedirect(null);
                    navigate(targetPath);
                }
                setIsModalOpen(false);
            } else {
                toast.error(res.data?.message || "Error while registering");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const Logout = () => {
        localStorage.clear();
        setWelcomeName("");
        setRole(null);
        toast.success("Logged out successfully");
        setDropdownOpen(false);
        navigate("/");
    };

    const isLoggedIn = !!localStorage.getItem("Authorization");

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl"
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                            <FaCar size={20} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            <span className="text-slate-900 dark:text-white uppercase transition-colors">GO</span>
                            <span className="text-blue-600 italic uppercase">CAR</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        <NavLink to="/" active={location.pathname === "/"}>Home</NavLink>
                        <NavLink to="/cars" active={location.pathname === "/cars"}>Our Cars</NavLink>
                        <NavLink
                            to={isLoggedIn ? "/bookings" : "#"}
                            active={location.pathname === "/bookings"}
                            onClick={(e) => {
                                if (!isLoggedIn) {
                                    e.preventDefault();
                                    toast.error("Please login to access your bookings");
                                    setPendingRedirect("/bookings");
                                    setIsModalOpen(true);
                                }
                            }}
                        >
                            My Booking
                        </NavLink>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        >
                            <FaSearch size={18} />
                        </button>

                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:border-blue-500 transition-all"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase tracking-tighter">
                                        {welcomeName.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{welcomeName}</span>
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 rounded-[1.5rem] overflow-hidden z-50 p-3"
                                        >
                                            <div className="px-4 py-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl mb-2 flex flex-col items-center">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg uppercase tracking-tighter shadow-lg shadow-blue-500/20 mb-3">
                                                    {welcomeName.charAt(0)}
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Active Member</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{welcomeName}</p>
                                            </div>
                                            {role === 1 && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                                                >
                                                    <FaUserShield size={16} className="opacity-50" /> Portal Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={Logout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                <FaSignOutAlt size={16} className="opacity-50" /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 md:px-8 py-2.5 md:py-3 bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-slate-900 hover:text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-3 active:scale-95 duration-300 transform group"
                            >
                                <span className="hidden md:block">Login</span>
                                <span className="block md:hidden">Login</span>
                                <MdLogin size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-3 text-slate-900 dark:text-white"
                        >
                            <FaHome size={24} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="fixed inset-0 z-[150] bg-white dark:bg-slate-950 p-10 flex flex-col justify-between"
                    >
                        <div className="space-y-12">
                            <div className="flex justify-between items-center">
                                <span className="text-3xl font-black text-blue-600 italic uppercase">GOCAR</span>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaTimes size={32} className="text-slate-400" />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-8">
                                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                                <MobileNavLink to="/cars" onClick={() => setIsMobileMenuOpen(false)}>Our Cars</MobileNavLink>
                                <MobileNavLink
                                    to={isLoggedIn ? "/bookings" : "#"}
                                    onClick={(e) => {
                                        if (!isLoggedIn) {
                                            e.preventDefault();
                                            toast.error("Please login to access your bookings");
                                            setPendingRedirect("/bookings");
                                            setIsModalOpen(true);
                                            setIsMobileMenuOpen(false);
                                        } else {
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                >
                                    My Booking
                                </MobileNavLink>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}
                                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl"
                                >
                                    Pilot Access
                                </button>
                            ) : (
                                <button
                                    onClick={() => { Logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full py-6 bg-rose-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em]"
                                >
                                    Decommission
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm p-4 md:p-10 flex items-start justify-center pt-24"
                    >
                        <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[80vh]">
                            <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Find a Vehicle</h3>
                                <button onClick={() => { setIsSearchOpen(false); setSearch(""); setSBookings([]); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <MdClose size={24} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                <div className="relative">
                                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search for a vehicle or city..."
                                        className="w-full pl-16 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto p-6 md:p-8">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                                        <p className="mt-4 text-slate-500 font-medium">Searching vehicles...</p>
                                    </div>
                                ) : (sbookings || []).length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {(sbookings || []).map((car) => (
                                            <Link
                                                key={car._id}
                                                to={`/car/${car._id}`}
                                                onClick={() => setIsSearchOpen(false)}
                                                className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
                                            >
                                                <div className="w-full sm:w-28 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                                                    <img src={car.carImage} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" alt={car.carName} />
                                                </div>
                                                <div className="flex-1 w-full text-center sm:text-left">
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{car.carName}</h4>
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5">
                                                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">{car.carCategory}</span>
                                                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                                            <FaMapMarkerAlt size={10} /> {car.location}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-400">
                                                    <FaArrowRight size={12} />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    search && !loading && (
                                        <div className="text-center py-12 text-slate-500">
                                            No vehicles found matching your search.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Simplified Auth Modal */}
            <AnimatePresence>
                {isModalOpen && !isLoggedIn && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={`relative w-full ${isRegister ? "max-w-md" : "max-w-sm"} bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all duration-300`}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">{!isRegister ? "Login to GoCar" : "Create Account"}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                        <MdClose size={20} className="text-slate-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {isRegister && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 ml-1 mb-1 block">Full Name</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 ml-1 mb-1 block">Email Address</label>
                                        <input
                                            type="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 ml-1 mb-1 block">{!isRegister ? "Password" : "Set Password"}</label>
                                        <input
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>

                                    <button
                                        onClick={!isRegister ? Login : Register}
                                        disabled={loading}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (!isRegister ? "Sign In" : "Register")}
                                    </button>

                                    <div className="text-center pt-2">
                                        <button
                                            onClick={() => setIsRegister(!isRegister)}
                                            className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            {!isRegister ? "New here? Create an account" : "Already have an account? Login"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`relative py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active
            ? "text-blue-600"
            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300"
            }`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="navUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
            />
        )}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:text-blue-600 transition-colors"
    >
        {children}
    </Link>
)

export default Header;
