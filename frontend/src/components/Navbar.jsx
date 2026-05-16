// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold tracking-wider">
            CarBooker
          </Link>

          <div className="flex space-x-4 items-center">
            <Link to="/" className="hover:text-blue-200 transition">
              Cars
            </Link>

            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link to="/admin" className="hover:text-blue-200 transition">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="hover:text-blue-200 transition"
                  >
                    My Bookings
                  </Link>
                )}
                <span className="text-sm font-light border-l border-blue-400 pl-4 ml-2">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
