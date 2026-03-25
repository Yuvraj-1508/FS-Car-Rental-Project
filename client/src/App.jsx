import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import AOS from "aos";
import "aos/dist/aos.css";
import Cars from './components/Cars';
import MyBooking from './components/MyBooking';
import { Toaster } from 'react-hot-toast'
import CarDetailsPage from './components/CarDetailsPage';
import AdminPage from './components/Admin/AdminPage';
import Bookings from './components/Admin/components/Bookings';
import Dashboard from './components/Admin/components/Dashboard';
import Users from './components/Admin/components/Users';
import AdminCars from './components/Admin/components/AdminCars';
import Visiter from './components/Admin/components/Visiter';
import Payments from './components/Admin/components/Payments';
import AboutUs from './components/AboutUs';


const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark"); // force dark mode
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true,     // run only once
    });
  }, []);



  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/bookings' element={<MyBooking />} />
        <Route path='/car/:id' element={<CarDetailsPage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route
          path="/admin"
          element={<AdminPage />}
        >
          <Route index element={<Dashboard />} />  {/* /admin */}
          <Route path="users" element={<Users />} /> {/* /admin/users */}
          <Route path="cars" element={<AdminCars />} /> {/* /admin/cars */}
          <Route path="bookings" element={<Bookings />} />
          <Route path="visiter" element={<Visiter />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
    </>
  )
}

export default App