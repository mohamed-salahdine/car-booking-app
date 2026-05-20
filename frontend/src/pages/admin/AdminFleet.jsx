import { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

const AdminFleet = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    registration_number: "",
    daily_price: "",
    is_available: true,
    images: [],
  });

  const fetchCars = async () => {
    try {
      const response = await api.get("/cars");
      setCars(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCars();
  }, []);

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

    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images[]", formData.images[i]);
      }
    }

    try {
      await api.post("/cars", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Car added successfully!");
      setFormData({
        make: "",
        model: "",
        year: "",
        registration_number: "",
        daily_price: "",
        is_available: true,
        images: [],
      });
      document.getElementById("car-images-input").value = "";
      fetchCars(); // Refresh list
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add car. Check your inputs."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchCars();
    } catch (error) {
      alert("Failed to delete car.");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl font-semibold">Loading Fleet...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ADD CAR SECTION */}
      <div className="card-premium p-8">
        <h2 className="text-2xl font-extrabold text-navy-900 mb-8">Add New Car to Fleet</h2>
        {message && (
          <p className={`mb-6 p-4 rounded-xl font-bold ${message.includes("successfully") ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-600"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleAddCar} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input type="text" placeholder="Make (e.g., Toyota)" className="input-premium" required value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />
          <input type="text" placeholder="Model (e.g., Camry)" className="input-premium" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
          <input type="number" placeholder="Year (e.g., 2023)" className="input-premium" required value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
          <input type="text" placeholder="Registration Number" className="input-premium" required value={formData.registration_number} onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })} />
          <input type="number" step="0.01" placeholder="Daily Price ($)" className="input-premium" required value={formData.daily_price} onChange={(e) => setFormData({ ...formData, daily_price: e.target.value })} />
          <input type="file" id="car-images-input" multiple accept="image/*" className="input-premium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100" onChange={(e) => setFormData({ ...formData, images: e.target.files })} />
          <div className="flex items-center md:col-span-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <input type="checkbox" className="w-5 h-5 mr-3 text-brand-600 rounded border-gray-300 focus:ring-brand-500" checked={formData.is_available} onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} />
            <label className="text-navy-900 font-bold tracking-wide">Vehicle is available for immediate booking</label>
          </div>
          <button type="submit" className="btn-primary md:col-span-3 mt-4">Add Vehicle</button>
        </form>
      </div>

      {/* CAR LIST SECTION */}
      <div className="card-premium p-8">
        <h2 className="text-2xl font-extrabold text-navy-900 mb-8">Manage Fleet</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Car</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Reg #</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Price/Day</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cars.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No cars in fleet.</td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap font-bold text-navy-900">{car.make} {car.model} <span className="text-gray-400 font-medium">({car.year})</span></td>
                    <td className="px-6 py-5 whitespace-nowrap text-gray-500 font-mono text-sm">{car.registration_number}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-brand-600 font-bold">${car.daily_price}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${car.is_available ? 'bg-brand-50 text-brand-600' : 'bg-red-50 text-red-600'}`}>
                        {car.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right font-bold">
                      <Link to={`/admin/edit-car/${car.id}`} className="text-blue-600 hover:text-blue-500 mr-4 transition-colors">Edit</Link>
                      <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:text-red-500 transition-colors">Delete</button>
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

export default AdminFleet;
