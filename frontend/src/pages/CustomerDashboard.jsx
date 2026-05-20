import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Calendar, Car, Clock, Settings, User, ArrowRight, ChevronRight, Image as ImageIcon } from "lucide-react";

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
            <Link to="/" className="btn-accent shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] flex items-center gap-2">
              Book a New Ride <ArrowRight className="w-5 h-5" />
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
            <div className="card-premium p-6 text-center group hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 mx-auto bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-navy-900">{loading ? "-" : upcomingTrips}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Upcoming</p>
            </div>
            <div className="card-premium p-6 text-center group hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-navy-900">{loading ? "-" : totalTrips}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Trips</p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="card-premium p-8 relative overflow-hidden group block">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <h2 className="text-xl font-extrabold text-navy-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" /> Quick Actions
            </h2>
            <div className="space-y-4 relative z-10">
              <Link to="/dashboard/bookings" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50/50 transition-all group/link">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  <span className="font-bold text-gray-700 group-hover/link:text-brand-600 transition-colors">Manage Bookings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-brand-600 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <Link to="/dashboard/profile" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all group/link">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-gray-700 group-hover/link:text-purple-600 transition-colors">Profile Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-600 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card-premium p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">Recent Activity</h2>
              <Link to="/dashboard/bookings" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group">
                View All <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <Car className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium mb-4">You have no recent bookings.</p>
                <Link to="/" className="btn-secondary text-sm">Browse Cars</Link>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group gap-4">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {booking.car.images && booking.car.images.length > 0 ? (
                          <img src={booking.car.images[0]} alt="car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-navy-900 text-lg">{booking.car.make} <span className="text-brand-600">{booking.car.model}</span></h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mt-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{booking.start_date} <span className="mx-1">&rarr;</span> {booking.end_date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right w-full sm:w-auto flex justify-between sm:block items-center">
                      <p className="font-extrabold text-navy-900 sm:mb-2 text-lg">${booking.total_price}</p>
                      <span className={`inline-block px-3 py-1.5 text-[10px] font-bold rounded-md tracking-wider uppercase ${booking.status === "cancelled" ? "bg-red-50 text-red-600" : booking.status === "completed" ? "bg-gray-100 text-gray-600" : "bg-brand-50 text-brand-600"}`}>
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
