import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const AdminPage = () => {
  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
        <Outlet />  {/* 👈 this will render child routes */}
      </div>
    </div>
  );
};

export default AdminPage;
