import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-xl font-semibold">Loading Bookings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-premium p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-navy-900 tracking-tight">All System Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Car</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap font-bold text-navy-900">{booking.user?.name}</td>
                    <td className="px-6 py-5 whitespace-nowrap font-medium text-gray-600">{booking.car?.make} <span className="text-gray-900">{booking.car?.model}</span></td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{booking.start_date} <span className="mx-1 text-gray-300">to</span> {booking.end_date}</td>
                    <td className="px-6 py-5 whitespace-nowrap font-extrabold text-brand-600">${booking.total_price}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${booking.status === "cancelled" ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"}`}>
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

export default AdminBookings;
