import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-16 px-6 md:px-20 border-t border-slate-100 dark:border-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo & About */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-blue-600 uppercase tracking-tighter">
            GO<span className="text-slate-900 dark:text-white">CAR</span>
          </h2>
          <p className="text-base opacity-80 leading-relaxed font-medium">
            Redefining the art of motion. Premium car rental services for those who command the extraordinary.
          </p>

        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Fleet Navigation</h4>
          <ul className="space-y-4 font-bold uppercase tracking-widest text-xs">
            <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link to="/cars" className="hover:text-blue-600 transition-colors">Cars</Link></li>
            <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Registry</h4>
          <ul className="space-y-4 font-bold uppercase tracking-widest text-xs">
            <li><Link to="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Protocol</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Command Center</h4>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
            <li className="text-slate-400">1234 Luxury Drive</li>
            <li className="text-slate-400">Surat Gujarat, 395006</li>
            <li className="text-blue-600">+91 987654 3210</li>
            <li className="text-slate-900 dark:text-white">info@gocar.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest opacity-40">
        <p>© {new Date().getFullYear()} GoCar. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Precision Engineering</span>
          <span>Status Defined</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
