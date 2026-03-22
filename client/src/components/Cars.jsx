import React, { useEffect, useState } from 'react'
import Layout from './layout/Layout'
import { FaSearch, FaFilter, FaCar, FaUsers, FaCogs, FaMapMarkerAlt, FaGasPump, FaStar, FaChevronRight, FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const Cars = () => {
    return (
        <Layout>
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                <CarsShowroom />
            </div>
        </Layout>
    )
}

const CarsShowroom = () => {
    const locationSearch = useLocation();
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("relevance"); // relevance, lowToHigh, highToLow

    const categories = ["All", "Sedan", "SUV", "Hatchback", "Sports", "Luxury"];

    useEffect(() => {
        const params = new URLSearchParams(locationSearch.search);
        const loc = params.get("location");
        if (loc) {
            setCityFilter(loc);
        }
    }, [locationSearch.search]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/cars`);
            if (res.data?.success) {
                setCars(res.data.cars);
                setFilteredCars(res.data.cars);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching cars");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        let result = cars.filter(car => {
            const matchesSearch = car.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = !cityFilter || car.location.toLowerCase().includes(cityFilter.toLowerCase());
            const matchesCategory = activeFilter === "All" || car.carCategory === activeFilter;
            return matchesSearch && matchesCity && matchesCategory && car.isAvailable !== false;
        });

        // Sorting Logic
        if (sortOrder === "lowToHigh") {
            result.sort((a, b) => a.carRent - b.carRent);
        } else if (sortOrder === "highToLow") {
            result.sort((a, b) => b.carRent - a.carRent);
        }

        setFilteredCars([...result]);
    }, [searchTerm, activeFilter, sortOrder, cars]);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-64 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl col-span-1"></div>
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <br></br><br></br><br></br>

                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    Premium <span className="text-blue-600">Showroom</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Explore {filteredCars.length} vehicles ready for your next journey.</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* LEFT SIDEBAR: Filters */}
                <motion.aside
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-72 space-y-8"
                >
                    {/* Search */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Search</h3>
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search model..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Category</h3>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none">
                                <FaFilter size={12} />
                            </div>
                            <select
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none dark:text-white font-bold cursor-pointer hover:border-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-white dark:bg-slate-900">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <FaChevronRight className="rotate-90" size={10} />
                            </div>
                        </div>
                    </div>

                    {/* Price Sorting */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Sort By Price</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSortOrder("lowToHigh")}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${sortOrder === "lowToHigh"
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                                    }`}
                            >
                                <FaSortAmountUp /> Low to High
                            </button>
                            <button
                                onClick={() => setSortOrder("highToLow")}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${sortOrder === "highToLow"
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                                    }`}
                            >
                                <FaSortAmountDownAlt /> High to Low
                            </button>
                            <button
                                onClick={() => setSortOrder("relevance")}
                                className={`px-5 py-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-tight`}
                            >
                                Reset Sorting
                            </button>
                        </div>
                    </div>
                </motion.aside>

                <main className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredCars.map((car, index) => (
                                <motion.div
                                    layout
                                    key={car._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={car.carImage}
                                            alt={car.carName}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-slate-900 shadow-sm">
                                                {car.carYear}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {car.carName}
                                                </h3>
                                                <p className="text-slate-500 text-sm mt-0.5">{car.carCategory}</p>
                                            </div>
                                            <div className="text-right shrink-0 ml-4">
                                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                                    ₹{car.carRent}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">/ day</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 my-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex-grow">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <FaUsers size={14} className="text-slate-400" />
                                                <span className="text-sm font-medium">{car.carSeats} Seats</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <FaGasPump size={14} className="text-slate-400" />
                                                <span className="text-sm font-medium">{car.carFuel}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <FaCogs size={14} className="text-slate-400" />
                                                <span className="text-sm font-medium truncate">{car.carGear}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <FaMapMarkerAlt size={14} className="text-slate-400" />
                                                <span className="text-sm font-medium truncate" title={car.location}>{car.location}</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/car/${car._id}`}
                                            className="w-full text-center py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 text-slate-900 dark:text-white hover:text-white rounded-xl font-semibold transition-colors duration-300 mt-auto"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredCars.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center"
                        >
                            <div className="text-8xl mb-6">🏝️</div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No Vehicles Found</h3>
                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Try adjusting your filters or sorting to find your car.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setCityFilter(""); setActiveFilter("All"); setSortOrder("relevance") }}
                                className="mt-8 text-blue-600 font-bold hover:underline"
                            >
                                Reset All Filters
                            </button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Cars;
