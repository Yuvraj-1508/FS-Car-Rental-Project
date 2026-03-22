import React from "react";
import Layout from "./layout/Layout";
import { FaCarSide, FaUsers, FaShieldAlt, FaClock, FaMapMarkedAlt, FaStar } from "react-icons/fa";

const AboutUs = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right" className="space-y-5">
            <p className="text-xs tracking-[0.25em] text-blue-400 uppercase">
              About CarRental
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Making every journey{" "}
              <span className="text-blue-400">smooth, safe, and memorable.</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              CarRental is a modern car rental platform built to make it effortless
              for you to drive your dream car—whether it&apos;s for a weekend
              getaway, a business trip, or your daily commute.
            </p>
            <p className="text-gray-400 text-sm">
              With a curated collection of well-maintained cars, transparent pricing,
              and a seamless booking experience, we ensure you spend less time
              worrying about travel and more time enjoying the ride.
            </p>
          </div>

          <div
            data-aos="fade-left"
            className="relative rounded-3xl bg-gray-900/80 border border-gray-700 p-6 md:p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-10 -right-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-14 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                  <FaCarSide size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">
                    Wide Range of Cars
                  </h3>
                  <p className="text-xs text-gray-400">
                    From budget rides to luxury sedans and SUVs, we have a car for every occasion.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400">
                  <FaShieldAlt size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">
                    Safe & Verified
                  </h3>
                  <p className="text-xs text-gray-400">
                    Each car is checked for safety, cleanliness, and quality before every trip.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/15 rounded-2xl text-yellow-400">
                  <FaClock size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">
                    24/7 Support
                  </h3>
                  <p className="text-xs text-gray-400">
                    Our support team is always a call away to assist you during your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Mission */}
      <section className="bg-base-300 text-gray-100 py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr,1fr] gap-10 items-start">
          <div data-aos="fade-up" className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Our Mission
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              We started CarRental with a simple goal: to make car rentals as easy
              as booking a movie ticket. No endless calls, no hidden charges, and
              no last-minute surprises.
            </p>
            <p className="text-gray-400 text-sm">
              By combining technology with a customer-first mindset, we aim to
              build the most trusted car rental experience—where every trip feels
              premium, no matter the distance.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                <p className="text-2xl md:text-3xl font-extrabold text-blue-400">
                  150+
                </p>
                <p className="text-xs text-gray-400 mt-1">Cars available</p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                <p className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  10k+
                </p>
                <p className="text-xs text-gray-400 mt-1">Happy customers</p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                <p className="text-2xl md:text-3xl font-extrabold text-yellow-400">
                  4.8
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <FaStar /> Rating
                </p>
              </div>
            </div>
          </div>

          <div
            data-aos="fade-left"
            className="bg-gray-900 rounded-2xl p-6 md:p-7 border border-gray-700 space-y-4 shadow-xl"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaUsers className="text-blue-400" /> Why drivers love us
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                Transparent pricing with no hidden fees.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                Flexible pickup and drop locations in major cities.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                Well-maintained cars with regular service checks.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                Easy online booking, secure payment, and instant confirmation.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Coverage / Cities */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Growing across major Indian cities
            </h2>
            <p className="text-sm md:text-base text-gray-400">
              We&apos;re rapidly expanding our network so that you can find a reliable
              rental car wherever you go.
            </p>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm"
            data-aos="zoom-in"
          >
            {[
              "Mumbai",
              "Delhi",
              "Bengaluru",
              "Pune",
              "Hyderabad",
              "Ahmedabad",
              "Chennai",
              "Kolkata",
            ].map((city) => (
              <div
                key={city}
                className="flex items-center gap-2 bg-gray-900/70 border border-gray-700 rounded-xl px-3 py-2"
              >
                <FaMapMarkedAlt className="text-blue-400" />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;


