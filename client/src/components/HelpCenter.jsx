import React from "react";
import Layout from "./layout/Layout";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaQuestionCircle,
  FaBook,
  FaMoneyCheckAlt,
  FaShieldAlt,
  FaCar,
  FaUserAlt,
  FaHeadset,
  FaEnvelope,
  FaPhoneAlt,
  FaAward
} from "react-icons/fa";

const HelpCenter = () => {
  const categories = [
    { title: "Booking & Reservations", icon: <FaBook className="text-blue-500" />, desc: "How to book, modify or cancel your rental." },
    { title: "Payments & Invoices", icon: <FaMoneyCheckAlt className="text-emerald-500" />, desc: "Understanding charges, refunds, and receipts." },
    { title: "Insurance & Safety", icon: <FaShieldAlt className="text-purple-500" />, desc: "Coverage options and what to do in an accident." },
    { title: "Fleet Information", icon: <FaCar className="text-yellow-500" />, desc: "Details about our cars, features, and fuel policies." },
    { title: "Account & Profile", icon: <FaUserAlt className="text-rose-500" />, desc: "Managing your personal info and document verification." },
    { title: "Member Rewards", icon: <FaAward className="text-orange-500" />, desc: "How to earn and redeem GOCAR loyalty points." }
  ];

  const faqs = [
    { q: "What documents do I need to rent a car?", a: "You need a valid driver's license, an ID proof (Aadhar/Passport), and a credit/debit card for the security deposit." },
    { q: "Can I cancel my booking?", a: "Yes, you can cancel up to 24 hours before the pickup time for a full refund. Cancellations within 24 hours may incur a small fee." },
    { q: "Is there a mileage limit?", a: "Most of our rentals come with unlimited mileage. Some specific luxury models may have a daily limit, which will be mentioned during booking." },
    { q: "What should I do if the car breaks down?", a: "Don't worry! We provide 24/7 roadside assistance. Just call our support number, and we'll send a team immediately." }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight"
          >
            How can we <span className="text-blue-500">help you</span> today?
          </motion.h1>

          <div className="max-w-2xl mx-auto relative group">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search for articles, guides, and more..."
              className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all text-lg backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{cat.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center text-balance">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex gap-3">
                    <FaQuestionCircle className="text-blue-500 mt-1 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 pl-8 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>


          </div>
        </div>
      </section>

      {/* Support Contact Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Still need help?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">Our support team is available 24/7 to assist you with any questions or issues.</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-3xl group hover:border-blue-500/50 transition-all">
              <FaHeadset className="text-3xl text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Live Chat</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Avg. response: 2 mins</p>
              <button className="text-blue-600 font-bold hover:underline">Start Chat</button>
            </div>
            <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-3xl group hover:border-emerald-500/50 transition-all">
              <FaPhoneAlt className="text-3xl text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Call Us</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Available 24/7</p>
              <button className="text-emerald-600 font-bold hover:underline">+1 800 123 456</button>
            </div>
            <div className="p-8 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-3xl group hover:border-purple-500/50 transition-all">
              <FaEnvelope className="text-3xl text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Email Us</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Response in 24 hrs</p>
              <button className="text-purple-600 font-bold hover:underline">Send Email</button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HelpCenter;
