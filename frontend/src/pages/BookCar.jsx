// frontend/src/pages/BookCar.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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

  if (loading)
    return (
      <div className="text-center mt-20 text-xl font-semibold">Loading...</div>
    );
  if (!car)
    return <div className="text-center mt-20 text-red-500">Car not found.</div>;

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
    <div className="max-w-3xl mx-auto mt-10 p-10 card-premium">
      <h2 className="text-4xl font-extrabold mb-8 text-navy-900 tracking-tight">
        Book <span className="text-brand-600">{car.make} {car.model}</span>
      </h2>

      <div className="mb-8 p-6 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100 shadow-sm">
        <div>
          <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Daily Rate</p>
          <p className="text-3xl font-extrabold text-navy-900">${car.daily_price}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Estimated Total</p>
          <p className="text-3xl font-extrabold text-brand-600">
            ${calculateTotal()}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-600 font-bold bg-red-50 p-4 rounded-xl mb-6">{error}</p>
      )}

      <form onSubmit={handleBooking} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Pick-up Date</label>
            <input
              type="date"
              className="input-premium"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Drop-off Date</label>
            <input
              type="date"
              className="input-premium"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary w-full text-lg py-4 mt-8"
        >
          Confirm Reservation
        </button>
      </form>
    </div>
  );
};

export default BookCar;
