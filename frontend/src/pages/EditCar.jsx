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
      } catch {
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
    <div className="max-w-3xl mx-auto mt-10 p-10 card-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
      <h2 className="text-3xl font-extrabold mb-8 text-navy-900 tracking-tight">
        Edit Car Details
      </h2>
      {message && <p className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 font-bold">{message}</p>}

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Make</label>
          <input
            type="text"
            className="input-premium"
            required
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Model</label>
          <input
            type="text"
            className="input-premium"
            required
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Year</label>
          <input
            type="number"
            className="input-premium"
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Registration</label>
          <input
            type="text"
            className="input-premium"
            required
            value={formData.registration_number}
            onChange={(e) =>
              setFormData({ ...formData, registration_number: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Daily Price ($)</label>
          <input
            type="number"
            step="0.01"
            className="input-premium"
            required
            value={formData.daily_price}
            onChange={(e) =>
              setFormData({ ...formData, daily_price: e.target.value })
            }
          />
        </div>
        <div className="flex items-center mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <input
            type="checkbox"
            className="w-5 h-5 mr-3 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
            checked={formData.is_available}
            onChange={(e) =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
          />
          <label className="text-navy-900 font-bold tracking-wide">
            Available for booking
          </label>
        </div>

        {/* 3. Added Image Input */}
        <div className="md:col-span-2 mt-2">
          <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">
            Upload New Images (Optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="input-premium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100"
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.files })
            }
          />
        </div>

        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            className="btn-primary w-full text-lg py-4"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
