// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Fetch only available cars
        const response = await api.get("/cars?available=1");
        setCars(response.data.data); // .data.data because of Laravel API Resources
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Loading Cars...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Find Your Perfect Ride
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
              {/* Placeholder for Car Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
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
                  {/* We will link this to the Booking page in the next step */}
                  <Link
                    to={`/book/${car.id}`}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
                  >
                    Book Now
                  </Link>
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
