// frontend/src/pages/BookCar.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const BookCar = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user && user.role === "admin") {
    navigate("/");
    return null;
  }

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data.data);
      } catch (err) {
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Book {car.make} {car.model}
      </h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-gray-600">Daily Rate:</p>
          <p className="text-2xl font-bold text-blue-600">${car.daily_price}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Estimated Total:</p>
          <p className="text-2xl font-bold text-green-600">
            ${calculateTotal()}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Pick-up Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
              value={startDate}
              min={new Date().toISOString().split("T")[0]} // Cannot book in the past
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Drop-off Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg mt-4"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookCar;
