import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CustomerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.password && formData.password !== formData.password_confirmation) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const response = await api.put("/user", formData);
      setMessage({ type: "success", text: response.data.message });
      // Update local context if needed, but the next page reload or me endpoint call will fetch the updated user
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-premium p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"></div>
        <h2 className="text-3xl font-extrabold mb-8 text-navy-900 tracking-tight">Profile Settings</h2>
        
        {message.text && (
          <div className={`p-4 rounded-xl mb-8 font-bold ${message.type === 'success' ? 'bg-brand-50 text-brand-600' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-premium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-premium"
            />
          </div>

          <div className="pt-6 border-t border-gray-100 mt-8">
            <h3 className="text-xl font-extrabold text-navy-900 mb-6">Security (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2 uppercase tracking-wide">Confirm New Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-md"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
