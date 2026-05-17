// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get current user

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      // If admin, fetch all cars. If customer/guest, fetch only available cars.
      const url = user?.role === "admin" ? "/cars" : "/cars?available=1";
      const response = await api.get(url);
      setCars(response.data.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this car? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/cars/${carId}`);
      // Remove the deleted car from the UI
      setCars(cars.filter((car) => car.id !== carId));
    } catch (error) {
      alert("Failed to delete car.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Loading Cars...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        {user?.role === "admin" ? "Fleet Management" : "Find Your Perfect Ride"}
      </h1>

      {cars.length === 0 ? (
        <p className="text-center text-gray-500">
          No cars are currently available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                {/* Admin Availability Badge */}
                {user?.role === "admin" && (
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${car.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {car.is_available ? "Available" : "Hidden"}
                  </span>
                )}
                <span className="text-gray-400 font-medium text-lg">
                  {car.make} {car.model}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">
                  {car.make} {car.model}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Year: {car.year} • Reg: {car.registration_number}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${car.daily_price}
                    <span className="text-sm font-normal text-gray-500">
                      /day
                    </span>
                  </span>

                  {/* CONDITIONAL BUTTONS BASED ON ROLE */}
                  {user?.role === "admin" ? (
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/edit-car/${car.id}`}
                        className="bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={`/book/${car.id}`}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
                    >
                      Book Now
                    </Link>
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

export default Home;
