// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

  // 1. SINGLE declaration of formData (with images array added)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    registration_number: "",
    daily_price: "",
    is_available: true,
    images: [],
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  // 2. SINGLE declaration of handleAddCar (using FormData for image upload)
  const handleAddCar = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("make", formData.make);
    data.append("model", formData.model);
    data.append("year", formData.year);
    data.append("registration_number", formData.registration_number);
    data.append("daily_price", formData.daily_price);
    data.append("is_available", formData.is_available ? 1 : 0);

    // Append each selected file to the FormData array
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images[]", formData.images[i]);
      }
    }

    try {
      // Send as multipart/form-data
      await api.post("/cars", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Car added successfully!");
      // Reset form completely
      setFormData({
        make: "",
        model: "",
        year: "",
        registration_number: "",
        daily_price: "",
        is_available: true,
        images: [],
      });

      // Clear the file input visually
      document.getElementById("car-images-input").value = "";
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add car. Check your inputs.",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ADD CAR SECTION */}
      <div className="bg-white p-8 rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Car to Fleet
        </h2>
        {message && (
          <p
            className={`mb-4 font-semibold ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleAddCar}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Make (e.g., Toyota)"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />

          <input
            type="text"
            placeholder="Model (e.g., Camry)"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Year (e.g., 2023)"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />

          <input
            type="text"
            placeholder="Registration Number"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.registration_number}
            onChange={(e) =>
              setFormData({ ...formData, registration_number: e.target.value })
            }
          />

          <input
            type="number"
            step="0.01"
            placeholder="Daily Price ($)"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.daily_price}
            onChange={(e) =>
              setFormData({ ...formData, daily_price: e.target.value })
            }
          />

          {/* FILE INPUT */}
          <input
            type="file"
            id="car-images-input"
            multiple
            accept="image/*"
            className="border p-1 rounded bg-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.files })
            }
          />

          <div className="flex items-center md:col-span-3">
            <input
              type="checkbox"
              className="w-5 h-5 mr-2"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData({ ...formData, is_available: e.target.checked })
              }
            />
            <label className="text-gray-700 font-medium">
              Available for booking
            </label>
          </div>

          <button
            type="submit"
            className="bg-gray-900 text-white font-bold p-3 rounded hover:bg-gray-800 transition md:col-span-3 mt-2"
          >
            Add Car
          </button>
        </form>
      </div>

      {/* ALL BOOKINGS SECTION */}
      <div className="bg-white p-8 rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          All System Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {booking.user?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.car?.make} {booking.car?.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.start_date} to {booking.end_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                      ${booking.total_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {booking.status}
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

export default AdminDashboard;
