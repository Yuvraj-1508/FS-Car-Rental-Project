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
    { label: "Fleet Size", value: stats.cars > 0 ? `${stats.cars}+` : "150+", icon: <FaCarSide />, color: "text-blue-400" },
    { label: "Happy Users", value: stats.users > 0 ? (stats.users < 100 ? `${stats.users}+` : `${Math.floor(stats.users / 100) * 100}+`) : "100+", icon: <FaUsers />, color: "text-emerald-400" },
    { label: "City Presence", value: `${stats.citiesCount}+`, icon: <FaMapMarkedAlt />, color: "text-purple-400" },
    { label: "Avg Rating", value: stats.rating, icon: <FaStar />, color: "text-yellow-400" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/about_hero.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.span 
              variants={itemVariants}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full"
            >
              Our Story
            </motion.span>
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Elevating Every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Journey We Touch.
              </span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            >
              Since our inception, we&apos;ve been on a mission to redefine the car rental experience. 
              Built for the modern traveler, combined with timeless service.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Floating over transition */}
      <section className="relative z-20 -mt-16 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-gray-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center"
              >
                <div className={`text-2xl mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="/assets/about_mission.png" 
                  alt="Modern Car Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Driven by <span className="text-blue-500">Excellence</span>,<br />
                  Inspired by You.
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
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
                    icon: <FaAward className="text-blue-400" />
                  },
                  { 
                    title: "Our Vision", 
                    desc: "To become the global standard for premium car rentals, powered by cutting-edge technology.",
                    icon: <FaHandshake className="text-emerald-400" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="text-2xl mt-1 shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="container mx-auto px-6 text-center mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Values that Drive Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg text-balance">
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
              color: "from-blue-500/20 to-blue-500/5",
              borderColor: "border-blue-500/20"
            },
            {
              title: "Customer First",
              desc: "Your journey matters. From 24/7 support to flexible scheduling, we&apos;re here to make your travel effortless.",
              icon: <FaUsers />,
              color: "from-emerald-500/20 to-emerald-500/5",
              borderColor: "border-emerald-500/20"
            },
            {
              title: "Sustainability",
              desc: "We&apos;re progressively introducing electric and hybrid options to our fleet to ensure a greener future.",
              icon: <FaLeaf />,
              color: "from-purple-500/20 to-purple-500/5",
              borderColor: "border-purple-500/20"
            }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-10 rounded-3xl border ${value.borderColor} bg-gradient-to-br ${value.color} backdrop-blur-sm relative group`}
            >
              <div className="text-4xl text-white mb-6 group-hover:scale-110 transition-transform">{value.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-24 bg-gradient-to-b from-black to-[#050505]">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600/10 via-white/5 to-purple-600/10 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Visual background effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-500/5 pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Serving Across India</h2>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-12">
                {stats.cities.map((city) => (
                  <span 
                    key={city}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-300 transition-colors cursor-default"
                  >
                    {city}
                  </span>
                ))}
              </div>
              <p className="text-xl text-gray-400">Expanding rapidly to your city soon.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;



