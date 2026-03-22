import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../../Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaCar, FaPlus, FaEdit, FaTrash, FaSearch, FaGasPump, FaCogs, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch Cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${base_url}/api/cars`);
      if (data.success) setCars(data.cars);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fleet");
    } finally {
      setLoading(false);
    }
  };

  // Add Car
  const addCar = async (formDataValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(formDataValues).forEach(([key, value]) => {
        if (key === "carImage" && value[0]) {
          formData.append("carImage", value[0]);
        } else if (key !== "carImage") {
          formData.append(key, value);
        }
      });

      const res = await axios.post(`${base_url}/api/create/car`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("Authorization")
        },
      });

      if (res.data.success) {
        toast.success("New Car Added to Fleet");
        setShowAddModal(false);
        fetchCars();
      }
    } catch (err) {
      console.error(err);
      toast.error("Deployment Failed");
    } finally {
      setLoading(false);
    }
  };

  // Update Car
  const updateCar = async (formDataValues) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(formDataValues).forEach(([key, value]) => {
        if (key === "carImage") {
          // Only append carImage if it's a File object (user picked a new one)
          if (value && value[0] instanceof File) {
            formData.append("carImage", value[0]);
          }
          // Else: Don't append. Backend should preserve old image if field is missing.
        } else {
          formData.append(key, value);
        }
      });

      const res = await axios.patch(`${base_url}/api/update/car/${formDataValues._id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("Authorization")
        }
      });

      if (res.data.success) {
        toast.success("Fleet Asset Reconfigured");
        setShowEditModal(false);
        fetchCars();
      }
    } catch (err) {
      console.error(err);
      toast.error("Fleet Update Failed. Please check network connection or asset data.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Car Status
  const toggleCarStatus = async (car) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("isAvailable", car.isAvailable === false ? true : false);

      const res = await axios.patch(`${base_url}/api/update/car/${car._id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("Authorization")
        }
      });

      if (res.data.success) {
        toast.success(`Asset marked as ${car.isAvailable === false ? 'Active' : 'Inactive'}`);
        fetchCars();
      }
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete Car
  const deleteCar = async (id) => {
    if (!window.confirm("Permanent Deletion: Are you sure?")) return;
    try {
      setLoading(true);
      const res = await axios.delete(`${base_url}/api/delete/car/${id}`, {
        headers: { Authorization: localStorage.getItem("Authorization") }
      });
      if (res.data.success) {
        toast.success("Asset decommissioned successfully");
        fetchCars();
      }
    } catch (err) {
      console.error(err);
      toast.error("Decommissioning failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "available") return matchesSearch && car.isAvailable;
    if (filterStatus === "unavailable") return matchesSearch && car.isAvailable === false;
    return matchesSearch;
  });

  if (loading && cars.length === 0) return <Loader />;

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen text-slate-900 font-sans selection:bg-blue-600 scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <FaCar size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Inventory Control</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">CAR <span className="text-blue-600 italic underline decoration-blue-500/30">MANAGEMENT</span></h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto"
        >
          <div className="relative w-full sm:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search car by name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 font-bold text-sm text-slate-900 shadow-sm"
            />
          </div>
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus size={12} /> Register Car
          </button>
        </motion.div>
      </div>

      {/* Quick Stats & Filters */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full xl:w-auto">
          <StatCard label="Total Car" value={cars.length} color="text-blue-600" />
          <StatCard label="Live Premium" value={cars.filter(c => c.carRent > 5000).length} color="text-emerald-600" />
          <StatCard label="Available" value={cars.filter(c => c.isAvailable !== false).length} color="text-blue-500" />
          <StatCard label="Locations" value={[...new Set(cars.map(c => c.location))].length} color="text-purple-600" />
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-6">Car Details</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Pricing</th>
                <th className="px-8 py-6">Location</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCars.map((car, index) => (
                  <motion.tr
                    layout
                    key={car._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                          <img src={car.carImage} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase leading-none mb-1">{car.carName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{car.carYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {car.carCategory}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-blue-600 tracking-tight">₹{car.carRent}<span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/ Day</span></p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <FaMapMarkerAlt size={10} className="text-blue-500/50" />
                        <span className="text-xs font-bold uppercase truncate max-w-[120px]">{car.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCarStatus(car)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${car.isAvailable !== false ? "bg-emerald-500" : "bg-slate-300"}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${car.isAvailable !== false ? "translate-x-5" : "translate-x-1"}`} />
                        </button>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${car.isAvailable !== false ? "text-emerald-600" : "text-slate-400"}`}>
                          {car.isAvailable !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          onClick={() => { setSelectedCar(car); setShowEditModal(true); }}
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          onClick={() => deleteCar(car._id)}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredCars.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-40 text-center opacity-40">
          <FaCar size={60} className="mb-6" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">No Assets Found</h2>
          <p className="max-w-sm mt-2 font-medium">Try adjusting your search or add a new car to the fleet collection.</p>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <Modal title="Add Car" onClose={() => setShowAddModal(false)}>
            <CarForm onSubmit={addCar} onClose={() => setShowAddModal(false)} />
          </Modal>
        )}

        {showEditModal && selectedCar && (
          <Modal title="Reconfigure Asset" onClose={() => setShowEditModal(false)}>
            <CarForm
              onSubmit={updateCar}
              onClose={() => setShowEditModal(false)}
              defaultValues={selectedCar}
              isEdit
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm min-w-[200px]">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 leading-none">{label}</p>
    <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
  </div>
);

const FilterBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
      ? "bg-slate-900 text-white shadow-lg"
      : "text-slate-400 hover:text-slate-900"
      }`}
  >
    {label}
  </button>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[3.5rem] p-8 md:p-12 border border-slate-200 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
          <FaTimes size={20} />
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);

const CarForm = ({ onSubmit, onClose, defaultValues = {}, isEdit = false }) => {
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues });
  const imagePreview = watch("carImage");
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (imagePreview && imagePreview[0] instanceof File) {
      const url = URL.createObjectURL(imagePreview[0]);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [imagePreview]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {isEdit && <input type="hidden" {...register("_id")} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FormInput label="Vehicle Name" placeholder="e.g. BMW M8 Competition" register={register("carName", { required: true })} />
        <FormSelect label="Asset Category" register={register("carCategory", { required: true })}>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sports">Sports</option>
          <option value="Luxury">Luxury</option>
        </FormSelect>
        <FormInput label="Registry Year" placeholder="2024" register={register("carYear")} />

        <FormInput label="Seating Payload" type="number" register={register("carSeats", { required: true })} />
        <FormSelect label="Energy System" register={register("carFuel", { required: true })}>
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </FormSelect>
        <FormSelect label="Transmission" register={register("carGear", { required: true })}>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </FormSelect>

        <FormInput label="Base Location" placeholder="e.g. Mumbai" register={register("location", { required: true })} />
        <FormInput label="Rent (₹ / Day)" type="number" register={register("carRent", { required: true })} />

        <div className="group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">
            {isEdit ? "Asset Image Override" : "Register Fleet Image"}
          </label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-4 transition-all group-hover:border-blue-500/50 bg-slate-50 overflow-hidden min-h-[140px] flex items-center justify-center">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              {...register("carImage", { required: !isEdit })}
            />

            {filePreview ? (
              <div className="relative w-full h-full p-2 flex flex-col items-center">
                <img src={filePreview} className="h-16 w-16 object-cover rounded-xl border border-blue-500/30 mb-2" alt="preview" />
                <span className="text-[9px] font-black text-blue-600 uppercase">New Asset Ready</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <FaCloudUploadAlt size={30} className="text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
                <span className="text-[9px] font-black uppercase text-slate-400">
                  {isEdit ? "Update File" : "Deploy File"}
                </span>
              </div>
            )}
          </div>
          {isEdit && !filePreview && defaultValues.carImage && (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img src={defaultValues.carImage} className="w-8 h-8 rounded-lg object-cover opacity-50" alt="current" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Protected: <span className="text-blue-600/80 italic">Using Saved Asset</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-10 py-5 bg-slate-50 border border-slate-200 text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
          {isEdit ? "Reconfigure Asset" : "Submit"}
        </button>
      </div>
    </form>
  );
};

const FormInput = ({ label, register, type = "text", placeholder }) => (
  <div className="group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register}
      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm shadow-inner"
    />
  </div>
);

const FormSelect = ({ label, register, children }) => (
  <div className="group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">{label}</label>
    <select
      {...register}
      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm appearance-none cursor-pointer shadow-inner"
    >
      <option value="" className="bg-white">Select...</option>
      {children}
    </select>
  </div>
);

export default AdminCars;