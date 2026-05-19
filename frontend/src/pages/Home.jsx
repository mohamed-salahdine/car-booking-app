// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null); // State for pagination data
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]); // Re-fetch when page changes

  const fetchCars = async (page) => {
    setLoading(true);
    try {
      // Include page number in the request
      const url =
        user?.role === "admin"
          ? `/cars?page=${page}`
          : `/cars?available=1&page=${page}`;
      const response = await api.get(url);

      // Laravel Resource with pagination returns .data for items and .meta for pagination info
      setCars(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... handleDelete remains the same ...
  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await api.delete(`/cars/${carId}`);
      fetchCars(currentPage); // Refresh current page
    } catch (error) {
      alert("Failed to delete car.");
    }
  };

  if (loading && cars.length === 0)
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
              >
                {/* Display the first image if it exists */}
                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  {user?.role === "admin" && (
                    <span
                      className={`absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold rounded ${car.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {car.is_available ? "Available" : "Hidden"}
                    </span>
                  )}
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-lg">
                      {car.make} {car.model}
                    </span>
                  )}
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

          {/* PAGINATION CONTROLS */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center mt-10 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="flex items-center text-gray-600 font-medium">
                Page {currentPage} of {meta.last_page}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, meta.last_page))
                }
                disabled={currentPage === meta.last_page}
                className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
