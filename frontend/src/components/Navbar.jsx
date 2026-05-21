import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Settings, Menu, X } from "lucide-react";

const NavItem = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
        isActive
          ? "text-brand-600"
          : "text-gray-500 hover:text-navy-900"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t-full"></span>
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
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
      ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm" 
      : "bg-white border-b border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group relative shrink-0">
            {/* Premium Icon Container */}
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl group-hover:shadow-lg transition-all duration-300 overflow-hidden">
              <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-brand-400 transition-colors duration-300"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-brand-300 transition-colors duration-300"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Typographic Name */}
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black tracking-tight text-navy-900 leading-none flex items-center">
                AURA<span className="text-brand-600">DRIVE</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.25em] text-gray-400 uppercase mt-1">
                Luxury Mobility
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center space-x-1 h-full">
            {/* Guest Links */}
            {!user && (
              <>
                <NavItem to="/" label="Home" />
                <div className="w-px h-6 bg-gray-200 mx-4"></div>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-brand-600 px-4 transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary ml-2 px-5 py-2 text-sm">Create Account</Link>
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
              <div className="relative ml-4 pl-4 border-l border-gray-200 flex items-center h-full">
                <div 
                  className="flex items-center gap-3 cursor-pointer group h-full"
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="flex flex-col text-right hidden lg:flex">
                    <span className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">{user.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{user.role}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-100 shadow-sm group-hover:shadow transition-all">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-0 pt-2 w-56 z-50">
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 transform origin-top transition-all duration-200">
                        <div className="px-4 py-3 border-b border-gray-50 lg:hidden">
                          <p className="text-sm font-bold text-navy-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link 
                          to="/dashboard/profile" 
                          className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-brand-600 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
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
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-600 hover:text-brand-600 focus:outline-none p-2 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <div className={`md:hidden border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden bg-white ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
          {!user && (
            <>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Home</Link>
              <div className="h-px w-full bg-gray-100 my-2"></div>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Sign In</Link>
              <div className="px-4 mt-2">
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary block text-center w-full py-3 rounded-xl shadow-md">
                  Create Account
                </Link>
              </div>
            </>
          )}

          {user?.role === "customer" && (
            <>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Home</Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Dashboard</Link>
              <Link to="/dashboard/bookings" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">My Bookings</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Home</Link>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Overview</Link>
              <Link to="/admin/fleet" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Fleet</Link>
              <Link to="/admin/bookings" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Bookings</Link>
              <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg">Users</Link>
            </>
          )}

          {user && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
              <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center justify-between mb-2 mx-4">
                <div>
                  <p className="text-sm font-bold text-navy-900">{user.name}</p>
                  <p className="text-xs text-brand-600 uppercase font-bold tracking-wider">{user.role}</p>
                </div>
              </div>
              <Link 
                to="/dashboard/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mx-4 text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors flex items-center gap-3"
              >
                <Settings className="w-5 h-5" />
                Profile Settings
              </Link>
              <button onClick={handleLogout} className="mx-4 text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
