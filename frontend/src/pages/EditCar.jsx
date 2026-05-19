// frontend/src/pages/EditCar.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Added 'images: []' to initial state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    registration_number: "",
    daily_price: "",
    is_available: true,
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        // Load existing data, but reset the images array so the file input starts fresh
        setFormData({ ...response.data.data, images: [] });
      } catch (error) {
        setMessage("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // 2. The SINGLE, correct handleUpdate function
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("make", formData.make);
    data.append("model", formData.model);
    data.append("year", formData.year);
    data.append("registration_number", formData.registration_number);
    data.append("daily_price", formData.daily_price);
    data.append("is_available", formData.is_available ? 1 : 0);

    // Append images if the admin selected new ones
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images[]", formData.images[i]);
      }
    }

    // LARAVEL TRICK: Spoof the PUT request because of multipart/form-data
    data.append("_method", "PUT");

    try {
      await api.post(`/cars/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/"); // Go back to home after successful update
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update car.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-xl font-semibold">Loading...</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Car Details
      </h2>
      {message && <p className="mb-4 text-red-500 font-semibold">{message}</p>}

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-gray-700 mb-1">Make</label>
          <input
            type="text"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Model</label>
          <input
            type="text"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Year</label>
          <input
            type="number"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Registration</label>
          <input
            type="text"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.registration_number}
            onChange={(e) =>
              setFormData({ ...formData, registration_number: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Daily Price ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
            value={formData.daily_price}
            onChange={(e) =>
              setFormData({ ...formData, daily_price: e.target.value })
            }
          />
        </div>
        <div className="flex items-center mt-6">
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

        {/* 3. Added Image Input */}
        <div className="md:col-span-2 mt-4">
          <label className="block text-gray-700 mb-1">
            Upload New Images (Optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.files })
            }
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
