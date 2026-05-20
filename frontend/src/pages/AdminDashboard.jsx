import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

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
    return <div className="text-center mt-20 text-xl font-semibold">Loading Dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center mt-20 text-xl font-semibold text-red-500">Failed to load statistics.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Fleet Cars</span>
          <span className="text-4xl font-bold text-blue-600 mt-2">{stats.total_cars}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Bookings</span>
          <span className="text-4xl font-bold text-green-600 mt-2">{stats.total_bookings}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Active Customers</span>
          <span className="text-4xl font-bold text-purple-600 mt-2">{stats.total_users}</span>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-8 rounded-xl shadow border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-blue-600 hover:underline font-medium">View All Bookings &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recent_bookings.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No bookings found.</td></tr>
              ) : (
                stats.recent_bookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{booking.user?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.car?.make} {booking.car?.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.start_date} to {booking.end_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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
