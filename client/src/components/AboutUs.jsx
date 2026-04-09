import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaCarSide,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaMapMarkedAlt,
  FaStar,
  FaAward,
  FaHandshake,
  FaLeaf
} from "react-icons/fa";

const base_url = import.meta.env.VITE_BASE_URL || "https://carrental-eyvf.onrender.com";

const AboutUs = () => {
  const [stats, setStats] = useState({
    cars: 0,
    users: 0,
    citiesCount: 12,
    rating: 4.9,
    cities: [
      "Mumbai", "Delhi", "Bengaluru", "Pune",
      "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
      "Jaipur", "Chandigarh", "Goa", "Kochi"
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${base_url}/api/stats`);
        if (response.data.success) {
          setStats({
            cars: response.data.cars,
            users: response.data.users,
            citiesCount: response.data.citiesCount,
            rating: response.data.rating,
            cities: response.data.cities
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const statItems = [
    { label: "Our Cars", value: stats.cars > 0 ? `${stats.cars}+` : "150+", icon: <FaCarSide />, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Happy Users", value: stats.users > 0 ? (stats.users < 100 ? `${stats.users}+` : `${Math.floor(stats.users / 100) * 100}+`) : "100+", icon: <FaUsers />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "City Presence", value: `${stats.citiesCount}+`, icon: <FaMapMarkedAlt />, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Avg Rating", value: stats.rating, icon: <FaStar />, color: "text-amber-600", bgColor: "bg-amber-50" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-slate-50">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15]"
          style={{ backgroundImage: "url('/assets/about_hero.png')" }}
        />

        {/* Decorative Light Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-t from-slate-200/50 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase bg-blue-100/50 border border-blue-200 rounded-full"
            >
              Our Story
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1]"
            >
              Elevating Every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Journey We Touch.
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed font-medium"
            >
              Since our inception, we&apos;ve been on a mission to redefine the car rental experience.
              Built for the modern traveler, combined with timeless service.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Floating cards */}
      <section className="relative z-20 -mt-20 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl">
                <img
                  src="/assets/about_mission.png"
                  alt="Modern Car Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-[80px]" />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1]">
                  Driven by <span className="text-blue-600 italic">Excellence</span>,<br />
                  Inspired by You.
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  We started with a simple observation: car rentals were stuck in the past.
                  Complicated paperwork, hidden fees, and inconsistent quality were the norm.
                  We decided to change that.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Our Mission",
                    desc: "To provide world-class mobility solutions that are seamless, sustainable, and accessible to everyone.",
                    icon: <FaAward />,
                    color: "text-blue-600",
                    bg: "bg-blue-50"
                  },
                  {
                    title: "Our Vision",
                    desc: "To become the global standard for premium car rentals, powered by cutting-edge technology.",
                    icon: <FaHandshake />,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group">
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${item.bg} ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="container mx-auto px-6 text-center mb-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Values that Drive Us</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium italic">
              Beyond just providing keys, we provide a commitment to quality and service that you can rely on.
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Trust & Transparency",
              desc: "What you see is what you pay. No hidden costs, ever. We believe in building lasting relationships through honesty.",
              icon: <FaShieldAlt />,
              gradient: "from-blue-600 to-blue-700",
              shadow: "shadow-blue-200"
            },
            {
              title: "Customer First",
              desc: "Your journey matters. From 24/7 support to flexible scheduling, we&apos;re here to make your travel effortless.",
              icon: <FaUsers />,
              gradient: "from-emerald-600 to-emerald-700",
              shadow: "shadow-emerald-200"
            },
            {
              title: "Sustainability",
              desc: "We&apos;re progressively introducing electric and hybrid options to our fleet to ensure a greener future.",
              icon: <FaLeaf />,
              gradient: "from-purple-600 to-purple-700",
              shadow: "shadow-purple-200"
            }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200 relative group overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} text-white flex items-center justify-center text-3xl mb-8 shadow-2xl ${value.shadow} group-hover:scale-110 transition-transform`}>
                {value.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{value.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{value.desc}</p>

              {/* Cosmetic flourish */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} opacity-[0.03] rounded-bl-[100%]`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full" />

            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-none">Serving Across <span className="text-blue-500 italic">India</span></h2>
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mb-16 relative z-10">
              {stats.cities.map((city) => (
                <span
                  key={city}
                  className="px-8 py-4 bg-white/10 hover:bg-white hover:text-slate-900 border border-white/10 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all cursor-default"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xl text-blue-200 font-bold uppercase tracking-[0.3em]">Expansion in Progress</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;



