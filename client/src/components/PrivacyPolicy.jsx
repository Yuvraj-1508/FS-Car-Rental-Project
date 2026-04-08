import React from "react";
import Layout from "./layout/Layout";
import { motion } from "framer-motion";
import { FaUserShield, FaCookieBite, FaDatabase, FaLock, FaUserSlash } from "react-icons/fa";

const PrivacyPolicy = () => {
  const policies = [
    {
      title: "Data Collection",
      content: "We collect information you provide directly to us when you create an account, make a booking, or contact support. This includes your name, email, driver's license details, and payment information.",
      icon: <FaDatabase className="text-blue-500" />
    },
    {
      title: "How We Use Data",
      content: "Your data is used to process bookings, verify your driving eligibility, provide customer support, and send you important updates regarding your rental and our services.",
      icon: <FaUserShield className="text-emerald-500" />
    },
    {
      title: "Security Protocols",
      content: "We implement industry-standard encryption and security measures to protect your personal data from unauthorized access, alteration, or disclosure. All payments are processed through secure gateways.",
      icon: <FaLock className="text-purple-500" />
    },
    {
      title: "Cookie Usage",
      content: "GOCAR uses cookies to enhance your browsing experience, remember your preferences, and analyze traffic. You can manage your cookie preferences through your browser settings.",
      icon: <FaCookieBite className="text-yellow-500" />
    },
    {
      title: "Your Rights & Control",
      content: "You have the right to access, correct, or delete your personal information at any time. You can also opt-out of marketing communications by following the unsubscribe link in our emails.",
      icon: <FaUserSlash className="text-rose-500" />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-3xl text-emerald-500 mx-auto mb-8 border border-emerald-500/30">
                <FaUserShield />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Privacy <span className="text-emerald-500">Protocol</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em]">Guardian of Your Personal Information</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid gap-12">
            {policies.map((policy, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-16 h-16 bg-white dark:bg-slate-850 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm shrink-0">
                        {policy.icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                            {policy.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            {policy.content}
                        </p>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
