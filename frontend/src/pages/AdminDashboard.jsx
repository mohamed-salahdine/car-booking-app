import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { Users, CarFront, CalendarCheck, ChevronRight, LayoutDashboard, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-navy-800">Loading Dashboard...</h2>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center mt-20 text-xl font-semibold text-red-500">Failed to load statistics.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-navy-900 text-white rounded-xl shadow-lg">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Real-time metrics and recent activity across your platform.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-premium p-8 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Fleet Cars</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CarFront className="w-5 h-5" />
            </div>
          </div>
          <span className="text-5xl font-extrabold text-navy-900">{stats.total_cars}</span>
        </div>
        
        <div className="card-premium p-8 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Bookings</span>
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-5xl font-extrabold text-navy-900">{stats.total_bookings}</span>
        </div>
        
        <div className="card-premium p-8 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Active Customers</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-5xl font-extrabold text-navy-900">{stats.total_users}</span>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card-premium p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-navy-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 transition-colors group">
            View All <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-8 px-8">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Car</th>
                <th className="py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recent_bookings.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-gray-500 font-medium">No recent bookings.</td></tr>
              ) : (
                stats.recent_bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 pr-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                          {booking.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-navy-900">{booking.user?.name}</span>
                      </div>
                    </td>
                    <td className="py-5 pr-6 whitespace-nowrap font-medium text-gray-600">
                      {booking.car?.make} <span className="text-gray-900">{booking.car?.model}</span>
                    </td>
                    <td className="py-5 pr-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {booking.start_date} <span className="mx-1 text-gray-300">to</span> {booking.end_date}
                    </td>
                    <td className="py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${booking.status === 'cancelled' ? 'bg-red-50 text-red-600' : booking.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-brand-50 text-brand-600'}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
