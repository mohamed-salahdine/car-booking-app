import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const upcomingTrips = bookings.filter(b => b.status === "confirmed" || b.status === "pending").length;
  const totalTrips = bookings.length;
  const recentBookings = bookings.slice(0, 3); // Get top 3

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* WELCOME BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-navy-900 shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-800 opacity-90"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Welcome back, <span className="text-brand-400">{user?.name}</span>!
            </h1>
            <p className="text-gray-300 text-lg max-w-xl font-medium">
              Ready for your next journey? Explore our latest collection of premium vehicles and hit the road in style.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/" className="btn-accent shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
              Book a New Ride
            </Link>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Stats & Quick Links */}
        <div className="lg:col-span-1 space-y-10">
          
          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <p className="text-3xl font-extrabold text-navy-900">{loading ? "-" : upcomingTrips}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Upcoming</p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-3xl font-extrabold text-navy-900">{loading ? "-" : totalTrips}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Trips</p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="card-premium p-8 relative overflow-hidden group block">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <h2 className="text-xl font-extrabold text-navy-900 mb-6">Quick Actions</h2>
            <div className="space-y-4 relative z-10">
              <Link to="/dashboard/bookings" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50/50 transition-all group/link">
                <span className="font-bold text-gray-700 group-hover/link:text-brand-600 transition-colors">Manage Bookings</span>
                <span className="text-brand-600 font-bold transform group-hover/link:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link to="/dashboard/profile" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all group/link">
                <span className="font-bold text-gray-700 group-hover/link:text-purple-600 transition-colors">Profile Settings</span>
                <span className="text-purple-600 font-bold transform group-hover/link:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card-premium p-8 h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">Recent Activity</h2>
              <Link to="/dashboard/bookings" className="text-sm font-bold text-brand-600 hover:text-brand-700">View All</Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <p className="text-gray-500 font-medium mb-4">You have no recent bookings.</p>
                <Link to="/" className="btn-secondary text-sm">Browse Cars</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {booking.car.images && booking.car.images.length > 0 ? (
                          <img src={booking.car.images[0]} alt="car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2m14 0a2 2 0 11-4 0 2 2 0 014 0zm-14 0a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-navy-900 text-lg">{booking.car.make} <span className="text-brand-600">{booking.car.model}</span></h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">{booking.start_date} <span className="mx-1">&rarr;</span> {booking.end_date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-navy-900 mb-2">${booking.total_price}</p>
                      <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-md tracking-wider uppercase ${booking.status === "cancelled" ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
