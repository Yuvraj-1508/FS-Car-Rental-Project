import React from "react";
import Layout from "./layout/Layout";
import { motion } from "framer-motion";
import { FaGavel, FaCheckCircle, FaExclamationTriangle, FaFileContract } from "react-icons/fa";

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using GOCAR Elite Fleet services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time.",
      icon: <FaCheckCircle className="text-blue-500" />
    },
    {
      title: "2. Eligibility & Verification",
      content: "To rent a vehicle, you must be at least 21 years of age and possess a valid driver's license. All users must undergo a verification process, which includes identity proofing and background checks on driving records.",
      icon: <FaFileContract className="text-emerald-500" />
    },
    {
      title: "3. Rental Policies",
      content: "Our vehicles are provided for personal use only. Sub-leasing, illegal activities, or off-road driving are strictly prohibited. The vehicle must be returned in the same condition as picked up, with the agreed fuel level.",
      icon: <FaGavel className="text-purple-500" />
    },
    {
      title: "4. Payments & Security Deposit",
      content: "A security deposit is required for all rentals. This amount is pre-authorized on your card and released after the vehicle is returned without damage. All rental fees must be paid in full before the trip starts.",
      icon: <FaCheckCircle className="text-yellow-500" />
    },
    {
      title: "5. Cancellation & Refunds",
      content: "Cancellations made 24 hours prior to the pickup time are eligible for a full refund. Same-day cancellations may incur a 25% fee. No-shows will be charged the full amount of the first day's rental.",
      icon: <FaExclamationTriangle className="text-rose-500" />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-slate-950 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 text-center"
          >
            Terms of <span className="text-blue-500">Service</span>
          </motion.h1>
          <p className="text-slate-400 text-center text-sm font-bold uppercase tracking-[0.2em]">Last Updated: April 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        {section.icon}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {section.title}
                    </h2>
                </div>
                <div className="pl-16">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                        {section.content}
                    </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Questions about our terms?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">If you have any questions or concerns regarding our terms of service, please contact our legal team.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                Contact Legal Support
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfService;
