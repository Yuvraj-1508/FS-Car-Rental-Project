import React, { useEffect, useState } from 'react'
import Layout from './layout/Layout'
import { FaHeart, FaCar, FaUsers, FaCogs, FaMapMarkerAlt, FaGasPump, FaTrashAlt, FaChevronRight } from "react-icons/fa";
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("Authorization");

    const fetchWishlist = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/wishlist/all`, {
                headers: { Authorization: token }
            });
            if (res.data?.success) {
                setWishlist(res.data.wishlist);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    const removeFromWishlist = async (carId) => {
        try {
            const res = await axios.delete(`${base_url}/api/wishlist/remove/${carId}`, {
                headers: { Authorization: token }
            });
            if (res.data.success) {
                setWishlist(wishlist.filter(item => item.carId?._id !== carId));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    if (loading) return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-32 animate-pulse">
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-64 mx-auto mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                    ))}
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center md:text-left">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase"
                        >
                            Your <span className="text-blue-600">Favorites</span>
                        </motion.h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-bold uppercase tracking-[0.2em]">
                            {wishlist.length} Vehicles saved in your fleet
                        </p>
                    </div>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {wishlist.map((item) => {
                                    const car = item.carId;
                                    if (!car) return null;
                                    return (
                                        <motion.div
                                            key={car._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                                        >
                                            {/* Image */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img 
                                                    src={car.carImage} 
                                                    alt={car.carName}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-6 right-6">
                                                    <button 
                                                        onClick={() => removeFromWishlist(car._id)}
                                                        className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                                                    >
                                                        <FaTrashAlt size={18} />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-6 left-6">
                                                    <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                                                        {car.carCategory}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                                                        {car.carName}
                                                    </h3>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">₹{car.carRent}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ Day</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                        <FaUsers className="text-blue-500" /> {car.carSeats} Seats
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                        <FaGasPump className="text-blue-500" /> {car.carFuel}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <Link 
                                                        to={`/car/${car._id}`}
                                                        className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
                                                    >
                                                        Book Asset
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center bg-white dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800"
                        >
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
                                <FaHeart className="text-slate-300" size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Elite Fleet Empty</h2>
                            <p className="text-slate-500 mb-10 text-sm font-medium uppercase tracking-widest">You haven't favorited any vehicles yet.</p>
                            <Link 
                                to="/cars"
                                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all inline-block"
                            >
                                Browse Our Fleet
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Wishlist;
