import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTrash, FaCheckCircle, FaClock, FaTimesCircle, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const base_url =
  import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const statusConfig = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <FaClock className="text-amber-500" />,
    label: "Pending"
  },
  confirmed: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <FaCheckCircle className="text-emerald-500" />,
    label: "Confirmed"
  },
  cancelled: {
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: <FaTimesCircle className="text-rose-500" />,
    label: "Cancelled"
  },
};

const statusOptions = ["pending", "confirmed", "cancelled"];

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchBookings = async () => {
    try {
      const authHeader = localStorage.getItem("Authorization");
      const res = await axios.get(`${base_url}/api/all/booking`, {
        headers: { Authorization: authHeader },
      });

      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const authHeader = localStorage.getItem("Authorization");
      const res = await axios.put(
        `${base_url}/api/all/booking/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      if (res.data.success)
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
        );
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      const authHeader = localStorage.getItem("Authorization");
      const res = await axios.delete(`${base_url}/api/delete/booking/${id}`, {
        headers: { Authorization: authHeader }
      });

      if (res.data.success)
        setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.carId?.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.includes(searchTerm);

    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    revenue: bookings.reduce((acc, curr) => {
      const payment = Number(curr.TotalPay) || 0;
      return acc + (curr.status === "confirmed" ? payment : 0);
    }, 0)
  };

  if (loading)
    return (
      <div className="w-full min-h-screen bg-white dark:bg-white flex flex-col items-center justify-center p-8 transition-colors duration-300">
        <div className="w-full max-w-6xl space-y-8 animate-pulse">
          <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-3xl w-full"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-800 rounded-2xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full py-12 px-4 bg-white dark:bg-white min-h-screen transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-900 tracking-tight transition-colors duration-300">
            Booking Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-500 mt-2 text-lg font-medium transition-colors duration-300">
            Manage your car's rental activity and performance.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Bookings", value: stats.total, color: "blue" },
            { label: "Pending Approval", value: stats.pending, color: "amber" },
            { label: "Confirmed Rides", value: stats.confirmed, color: "emerald" },
            { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: "indigo" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-white p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-200 transition-colors duration-300"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 text-${stat.color}-600 dark:text-${stat.color}-600`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-white p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-300">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by car, user or ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-700 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <FaFilter className="text-slate-400 ml-2 hidden md:block" />
            <select
              className="bg-slate-50 dark:bg-slate-50 border-none rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-700 w-full md:w-48 transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  layout
                  key={booking._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-white dark:bg-white rounded-3xl p-5 border border-slate-200 dark:border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    <div className="relative w-full lg:w-72 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={booking.carId?.carImage || "/placeholder.jpg"}
                        alt={booking.carId?.carName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-100 text-slate-600 dark:text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider transition-colors duration-300">
                              #{booking._id.slice(-6)}
                            </span>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[booking.status].color}`}>
                              {statusConfig[booking.status].icon}
                              {statusConfig[booking.status].label}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                            {booking.carId?.carName}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-500 text-sm mt-1 transition-colors duration-300">
                            {booking.carId?.carYear} • {booking.carId?.carFuel} • {booking.carId?.location}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                            title="Delete Booking"
                          >
                            <FaTrash size={18} />
                          </button>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            className="text-sm bg-slate-50 dark:bg-slate-50 border-none rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all font-medium text-slate-700 dark:text-slate-700"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-50 transition-colors duration-300 p-3 rounded-2xl">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <FaCalendarAlt />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight transition-colors duration-300">Rental Period</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-700 transition-colors duration-300">
                              {new Date(booking.fromDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(booking.toDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-50 transition-colors duration-300 p-3 rounded-2xl">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <FaUser />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight transition-colors duration-300">Customer</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-700 truncate w-32 md:w-full transition-colors duration-300">
                              {booking.userId?.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-100 flex justify-between items-end transition-colors duration-300">
                        <div className="text-xs text-slate-400">
                          Booked on {new Date(booking.createdAt).toLocaleString(undefined, { dateStyle: 'medium' })}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</p>
                          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none mt-1 transition-all group-hover:scale-110 origin-right">
                            ₹{booking.TotalPay.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
              >
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No bookings found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

