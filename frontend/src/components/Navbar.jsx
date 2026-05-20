import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Settings, User } from "lucide-react";

const NavItem = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 group overflow-hidden ${
        isActive
          ? "text-brand-700 bg-brand-50/80"
          : "text-gray-600 hover:text-navy-900"
      }`}
    >
      <span className="relative z-10">{label}</span>
      {!isActive && (
        <div className="absolute inset-0 bg-gray-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 rounded-full"></div>
      )}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-500">
      <nav className={`max-w-7xl mx-auto transition-all duration-500 rounded-3xl border ${
        scrolled 
        ? "bg-white/70 backdrop-blur-2xl border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]" 
        : "bg-white/90 backdrop-blur-xl border-white/20 shadow-lg"
      }`}>
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="absolute inset-0 bg-brand-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-navy-900 text-white p-2.5 rounded-xl group-hover:scale-105 group-hover:bg-brand-600 transition-all duration-300 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-navy-900 tracking-tight transition-colors duration-300">
                Luxe<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">Ride</span>
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Guest Links */}
              {!user && (
                <>
                  <NavItem to="/" label="Home" />
                  <NavItem to="/" label="Browse Cars" />
                  <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-3"></div>
                  <Link to="/login" className="text-gray-600 hover:text-navy-900 px-4 py-2 text-sm font-medium transition-colors">Sign In</Link>
                  <Link to="/register" className="btn-primary ml-2 py-2.5 px-6 text-sm shadow-[0_0_20px_rgba(15,23,42,0.15)] hover:shadow-[0_0_25px_rgba(15,23,42,0.25)]">Create Account</Link>
                </>
              )}

              {/* Customer Links */}
              {user?.role === "customer" && (
                <>
                  <NavItem to="/" label="Home" />
                  <NavItem to="/dashboard" label="Dashboard" />
                  <NavItem to="/dashboard/bookings" label="My Bookings" />
                </>
              )}

              {/* Admin Links */}
              {user?.role === "admin" && (
                <>
                  <NavItem to="/" label="Home" />
                  <NavItem to="/admin" label="Overview" />
                  <NavItem to="/admin/fleet" label="Fleet" />
                  <NavItem to="/admin/bookings" label="Bookings" />
                  <NavItem to="/admin/users" label="Users" />
                </>
              )}

              {/* AUTHENTICATED USER PROFILE */}
              {user && (
                <div className="relative ml-4 pl-4 flex items-center before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                    onMouseLeave={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="flex flex-col text-right hidden lg:flex">
                      <span className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">{user.name}</span>
                      <span className="text-[10px] text-brand-600 uppercase font-bold tracking-widest">{user.role}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-400 rounded-full blur opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm group-hover:shadow-md transition-all">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute top-12 right-0 pt-4 w-56 z-50">
                        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden py-2 transform origin-top transition-all duration-200">
                          <div className="px-4 py-3 border-b border-gray-50/50 lg:hidden bg-gray-50/30">
                            <p className="text-sm font-bold text-navy-900 truncate">{user.name}</p>
                            <p className="text-xs text-brand-600 uppercase font-bold tracking-wider truncate">{user.email}</p>
                          </div>
                          <Link 
                            to="/dashboard/profile" 
                            className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:text-brand-700 hover:bg-brand-50/50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Profile Settings
                          </Link>
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50/50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-navy-900 focus:outline-none p-2.5 bg-gray-50/80 hover:bg-gray-100 rounded-xl transition-colors">
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
      </nav>

      {/* MOBILE MENU PANEL */}
      <div className={`md:hidden max-w-7xl mx-auto transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="p-4 space-y-2 flex flex-col">
            {!user && (
              <>
                <NavItem to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/" label="Browse Cars" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                <NavItem to="/login" label="Sign In" onClick={() => setIsMobileMenuOpen(false)} />
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center w-full mt-2 py-3 rounded-xl shadow-md">
                  Create Account
                </Link>
              </>
            )}

            {user?.role === "customer" && (
              <>
                <NavItem to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/dashboard" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/dashboard/bookings" label="My Bookings" onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavItem to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin" label="Overview" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin/fleet" label="Fleet" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin/bookings" label="Bookings" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/admin/users" label="Users" onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}

            {user && (
              <div className="mt-2 pt-2 relative before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent flex flex-col gap-2">
                <div className="px-4 py-4 bg-gray-50/50 rounded-2xl flex items-center justify-between mb-1 mt-2">
                  <div>
                    <p className="text-sm font-bold text-navy-900">{user.name}</p>
                    <p className="text-xs text-brand-600 uppercase font-bold tracking-wider">{user.role}</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-4 py-3.5 text-sm font-bold text-gray-700 bg-gray-50/30 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors flex items-center gap-3"
                >
                  <Settings className="w-5 h-5" />
                  Profile Settings
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3.5 text-sm font-bold text-red-600 bg-red-50/50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
