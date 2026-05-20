// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active links
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Helper to check if a link is the current active page
  const isActive = (path) => location.pathname === path;

  // Reusable Nav Link Component
  const NavItem = ({ to, label }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              CarBooker
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-2">
            {/* 1. Guest Links */}
            {!user && (
              <>
                <NavItem to="/" label="Browse Cars" />
                <div className="border-l border-gray-200 h-6 mx-2"></div>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  Create Account
                </Link>
              </>
            )}

            {/* 2. Customer Links */}
            {user?.role === "customer" && (
              <>
                <NavItem to="/" label="Browse Cars" />
                <NavItem to="/dashboard" label="My Bookings" />
              </>
            )}

            {/* 3. Admin Links */}
            {user?.role === "admin" && (
              <>
                <NavItem to="/" label="Fleet Library" />
                <NavItem to="/admin" label="Dashboard & Settings" />
              </>
            )}

            {/* AUTHENTICATED USER PROFILE DRPODOWN/INFO */}
            {user && (
              <div className="flex items-center ml-4 pl-4 border-l border-gray-200 gap-4">
                <div className="flex flex-col text-right hidden lg:flex">
                  <span className="text-sm font-bold text-gray-900">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 uppercase font-semibold">
                    {user.role}
                  </span>
                </div>
                {/* Initials Avatar */}
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  /> // X icon
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  /> // Hamburger icon
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {!user && (
              <>
                <NavItem to="/" label="Browse Cars" />
                <NavItem to="/login" label="Sign In" />
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium mt-2"
                >
                  Create Account
                </Link>
              </>
            )}

            {user?.role === "customer" && (
              <>
                <NavItem to="/" label="Browse Cars" />
                <NavItem to="/dashboard" label="My Bookings" />
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavItem to="/" label="Fleet Library" />
                <NavItem to="/admin" label="Dashboard & Settings" />
              </>
            )}

            {user && (
              <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-2">
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Signed in as {user.name}
                  </p>
                  <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
