import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CalendarRange, DollarSign, CarFront, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const BookCar = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data.data);
      } catch {
        setError("Car not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/bookings", {
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
      });
      navigate("/dashboard"); // Go to dashboard on success
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book the car. Dates might be overlapping.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-navy-800">Preparing your vehicle...</h2>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold bg-red-50 p-6 rounded-xl max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-400" />
        Vehicle not found.
      </div>
    );
  }

  // Calculate total price dynamically on the frontend
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays === 0 ? 1 : diffDays; // Minimum 1 day
    return (days * car.daily_price).toFixed(2);
  };

  if (user && user.role === "admin") return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="card-premium p-10 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-navy-50 rounded-xl text-navy-900">
                <CarFront className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">
                {car.make} <span className="text-brand-600 font-light">{car.model}</span>
              </h2>
            </div>
            <p className="text-gray-500 font-medium ml-1">Complete your reservation details below</p>
          </div>
          <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 flex flex-col items-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Rate</span>
            <span className="text-3xl font-extrabold text-navy-900 flex items-center"><DollarSign className="w-6 h-6 text-brand-600 mr-0.5" />{car.daily_price}</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Pick-up Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarRange className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="input-premium pl-12"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Drop-off Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarRange className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="input-premium pl-12"
                  value={endDate}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dynamic Summary Panel */}
          <div className={`transition-all duration-500 overflow-hidden rounded-2xl border ${startDate && endDate ? 'border-brand-200 bg-brand-50 max-h-40 opacity-100 p-6' : 'border-transparent max-h-0 opacity-0 p-0'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-brand-900 font-bold mb-1">Estimated Total</p>
                <p className="text-brand-700/80 text-sm font-medium">Includes base rate and standard insurance</p>
              </div>
              <div className="text-4xl font-extrabold text-brand-600 tracking-tight">
                ${calculateTotal()}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-lg py-5 flex justify-center items-center gap-2 group"
          >
            <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookCar;
