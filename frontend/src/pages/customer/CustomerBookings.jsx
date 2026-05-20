import { useState, useEffect } from "react";
import api from "../../services/api";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      alert("Failed to cancel booking.");
      console.error(error);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading Bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold mb-10 text-navy-900 tracking-tight">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-gray-500 font-medium text-lg">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="card-premium p-8 flex flex-col md:flex-row justify-between items-center group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="flex-1 relative z-10 w-full md:w-auto mb-6 md:mb-0">
                <h3 className="text-2xl font-extrabold text-navy-900">
                  {booking.car.make} <span className="text-brand-600">{booking.car.model}</span> <span className="text-sm font-medium text-gray-400">({booking.car.year})</span>
                </h3>
                <div className="mt-4 flex flex-col sm:flex-row sm:gap-8 gap-2">
                  <p className="text-sm text-gray-500 font-medium">Dates: <span className="text-gray-800">{booking.start_date}</span> to <span className="text-gray-800">{booking.end_date}</span></p>
                  <p className="text-sm font-bold text-navy-900">Total: <span className="text-brand-600 text-lg">${booking.total_price}</span></p>
                </div>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-lg tracking-wider ${booking.status === "cancelled" ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {booking.status !== "cancelled" && (
                <div className="md:ml-8 relative z-10 w-full md:w-auto">
                  <button onClick={() => handleCancel(booking.id)} className="w-full md:w-auto px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors font-bold shadow-sm">
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
