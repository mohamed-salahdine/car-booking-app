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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow border border-gray-100">
          You have no bookings yet.
        </p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {booking.car.make} {booking.car.model} <span className="text-sm font-normal text-gray-500">({booking.car.year})</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Dates: <span className="font-medium text-gray-900">{booking.start_date}</span> to <span className="font-medium text-gray-900">{booking.end_date}</span></p>
                  <p className="text-sm font-semibold text-blue-600 mt-1">Total: ${booking.total_price}</p>
                  <span className={`inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full ${booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                {booking.status !== "cancelled" && (
                  <div className="mt-4 md:mt-0">
                    <button onClick={() => handleCancel(booking.id)} className="bg-red-50 text-red-600 px-5 py-2 rounded-lg border border-red-200 hover:bg-red-100 transition font-medium">
                      Cancel Booking
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
