// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation,
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength="8"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            minLength="8"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
