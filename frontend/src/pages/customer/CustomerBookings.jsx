import { useState, useEffect } from "react";
import api from "../../services/api";
import { Calendar, DollarSign, CarFront, ChevronRight, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-navy-800">Loading your journey...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
          My Bookings
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Manage your upcoming trips, view past journeys, and handle cancellations all in one place.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="card-premium p-16 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <CarFront className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 font-medium text-lg max-w-md mx-auto mb-8">
            You haven't made any reservations yet. Ready to hit the road?
          </p>
          <Link to="/fleet" className="btn-accent inline-flex items-center gap-2">
            Explore Fleet <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="card-premium p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              {/* Car Info Section */}
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-navy-50 rounded-lg text-navy-900">
                    <CarFront className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-navy-900">
                    {booking.car.make} <span className="text-brand-600 font-light">{booking.car.model}</span>
                  </h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold ml-2">
                    {booking.car.year}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Dates</p>
                      <p className="font-semibold text-navy-800">{booking.start_date} &rarr; {booking.end_date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</p>
                      <p className="font-semibold text-brand-600">${booking.total_price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action Section */}
              <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-4 items-start sm:items-center lg:items-end lg:w-48 lg:border-l lg:border-gray-100 lg:pl-6">
                <div className="flex flex-col items-start lg:items-end gap-2 w-full">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg tracking-wider ${
                    booking.status === "cancelled" 
                      ? "bg-red-50 text-red-600" 
                      : booking.status === "completed"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-brand-50 text-brand-700"
                  }`}>
                    {booking.status === "cancelled" && <XCircle className="w-3.5 h-3.5" />}
                    {booking.status !== "cancelled" && booking.status !== "completed" && <AlertCircle className="w-3.5 h-3.5" />}
                    {booking.status.toUpperCase()}
                  </span>
                  
                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <button 
                      onClick={() => handleCancel(booking.id)} 
                      className="w-full text-center mt-2 px-5 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors font-semibold shadow-sm text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
