import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CarFront, Calendar, Hash, DollarSign, ImagePlus, Save, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
        setFormData({ ...response.data.data, images: [] });
      } catch {
        setMessage("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

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

    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images[]", formData.images[i]);
      }
    }

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-navy-800">Loading details...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="card-premium p-10 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
          <div className="p-3 bg-navy-50 text-navy-900 rounded-xl">
            <CarFront className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Edit Car Details
            </h2>
            <p className="text-gray-500 font-medium mt-1">Update specifications and availability for {formData.make} {formData.model}</p>
          </div>
        </div>

        {message && (
          <div className={`mb-8 flex items-start gap-3 p-4 rounded-xl border relative z-10 ${message.includes('Failed') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          <div className="space-y-3">
            <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Make</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CarFront className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-premium pl-12"
                required
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Model</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CarFront className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-premium pl-12"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Year</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                className="input-premium pl-12"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Registration Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-premium pl-12"
                required
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-navy-900 ml-1 uppercase tracking-wide">Daily Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                className="input-premium pl-12"
                required
                value={formData.daily_price}
                onChange={(e) => setFormData({ ...formData, daily_price: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center self-end h-[52px] bg-gray-50 px-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}>
            <input
              type="checkbox"
              className="w-5 h-5 mr-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 cursor-pointer pointer-events-none"
              checked={formData.is_available}
              readOnly
            />
            <label className="text-navy-900 font-bold tracking-wide cursor-pointer pointer-events-none">
              Available for booking
            </label>
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-bold text-navy-900 mb-3 uppercase tracking-wide">
              Upload New Images <span className="text-gray-400 font-normal normal-case">(Optional)</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-brand-300 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 font-medium"><span className="font-bold text-brand-600">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-400 font-medium">SVG, PNG, JPG or GIF</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, images: e.target.files })}
                />
              </label>
            </div>
            {formData.images && formData.images.length > 0 && (
              <p className="mt-3 text-sm text-brand-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {formData.images.length} file(s) selected for upload
              </p>
            )}
          </div>

          <div className="md:col-span-2 mt-8 pt-8 border-t border-gray-100">
            <button
              type="submit"
              className="btn-primary w-full text-lg py-5 flex justify-center items-center gap-2 group"
            >
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;
