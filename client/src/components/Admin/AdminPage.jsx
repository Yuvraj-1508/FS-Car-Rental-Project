import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminLogin from "./AdminLogin";
import toast from "react-hot-toast";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const role = localStorage.getItem("UserRole");
      const token = localStorage.getItem("Authorization");
      
      if (role === "1" && token) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  // High-Security Navigation Lock
  useEffect(() => {
    if (isAdmin) {
      // 1. Fill history buffer
      const fillHistory = () => {
        window.history.pushState(null, null, window.location.href);
      };
      
      fillHistory();

      // 2. The PopState Trap (Back/Forward)
      const handlePopState = (e) => {
        // Immediately force forward navigation
        window.history.forward();
        // Re-push state to ensure the stack stays full
        fillHistory();
        toast.error("Security Lock: Admin session active", { id: 'admin-lock' });
      };

      // 3. BeforeUnload Trap (Browser Tab Close/Back Multi-Click)
      const handleBeforeUnload = (e) => {
        if (window.isExiting) return; // Allow navigation if logging out
        e.preventDefault();
        e.returnValue = ''; // Shows the browser's default confirmation dialog
        return '';
      };

      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);

      // 4. Overwrite any attempt to navigate via script or rapid click
      const interval = setInterval(fillHistory, 500);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        clearInterval(interval);
      };
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
        <Outlet />  {/* 👈 this will render child routes */}
      </div>
    </div>
  );
};

export default AdminPage;
