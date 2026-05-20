import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavItem = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
        isActive
          ? "text-brand-700 bg-brand-50"
          : "text-gray-500 hover:text-navy-900 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-navy-900 text-white p-2.5 rounded-xl group-hover:bg-brand-600 transition-colors duration-300 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-navy-900 tracking-tight transition-colors duration-300">
              Luxe<span className="text-brand-600">Ride</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Guest Links */}
            {!user && (
              <>
                <NavItem to="/" label="Browse Cars" />
                <div className="border-l border-gray-200 h-6 mx-3"></div>
                <Link to="/login" className="text-gray-600 hover:text-navy-900 px-4 py-2 text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary ml-2 py-2 px-5 text-sm">Create Account</Link>
              </>
            )}

            {/* Customer Links */}
            {user?.role === "customer" && (
              <>
                <NavItem to="/" label="Browse Cars" />
                <NavItem to="/dashboard" label="Dashboard" />
                <NavItem to="/dashboard/bookings" label="My Bookings" />
              </>
            )}

            {/* Admin Links */}
            {user?.role === "admin" && (
              <>
                <NavItem to="/admin" label="Overview" />
                <NavItem to="/admin/fleet" label="Fleet" />
                <NavItem to="/admin/bookings" label="Bookings" />
                <NavItem to="/admin/users" label="Users" />
              </>
            )}

            {/* AUTHENTICATED USER PROFILE */}
            {user && (
              <div className="flex items-center ml-4 pl-4 border-l border-gray-200 gap-4">
                <div className="flex flex-col text-right hidden lg:flex">
                  <span className="text-sm font-bold text-navy-900">{user.name}</span>
                  <span className="text-xs text-brand-600 uppercase font-bold tracking-wider">{user.role}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 px-2 py-2 transition-colors ml-2" title="Logout">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-navy-900 focus:outline-none p-2 bg-gray-50 rounded-lg">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-3xl absolute w-full border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col">
            {!user && (
              <>
                <NavItem to="/" label="Browse Cars" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/login" label="Sign In" onClick={() => setIsMobileMenuOpen(false)} />
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center w-full mt-2">
                  Create Account
                </Link>
              </>
            )}

            {user?.role === "customer" && (
              <>
                <NavItem to="/" label="Browse Cars" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/dashboard" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/dashboard/bookings" label="My Bookings" onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavItem to="/admin" label="Overview" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin/fleet" label="Fleet" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin/bookings" label="Bookings" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin/users" label="Users" onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}

            {user && (
              <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-3">
                <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-navy-900">{user.name}</p>
                    <p className="text-xs text-brand-600 uppercase font-bold tracking-wider">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
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
