import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/"); // Redirect to home after login
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to login. Check your credentials.",
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background flourishes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <div className="card-premium p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-navy-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-3 font-medium">
            Sign in to manage your luxury rides
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium text-sm">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-navy-900 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="input-premium pl-12"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-navy-900 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="input-premium pl-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex justify-center items-center gap-2 mt-4"
          >
            Sign In <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-center mt-8 text-gray-600 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-600 font-bold hover:text-brand-700 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
