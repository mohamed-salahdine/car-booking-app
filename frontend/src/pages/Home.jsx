import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchCars = useCallback(async (page) => {
    setLoading(true);
    try {
      const url = user?.role === "admin" ? `/cars?page=${page}` : `/cars?available=1&page=${page}`;
      const response = await api.get(url);
      setCars(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCars(currentPage);
  }, [currentPage, fetchCars]);

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await api.delete(`/cars/${carId}`);
      fetchCars(currentPage);
    } catch (error) {
      alert("Failed to delete car.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* PREMIUM HERO SECTION */}
      <div className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-800 opacity-90"></div>
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto pt-24 pb-16 px-4 sm:pt-32 sm:pb-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            {user?.role === "admin" ? "Fleet Library Overview" : "Experience True Luxury"}
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-gray-300">
            {user?.role === "admin" 
              ? "Manage, update, and monitor your entire premium fleet from one powerful interface." 
              : "Discover our curated collection of premium vehicles designed to elevate your journey."}
          </p>
          {!user && (
            <div className="mt-10">
              <Link to="/register" className="btn-accent text-lg px-8 py-4 shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]">Explore Collection</Link>
            </div>
          )}
        </div>

        {/* Stats / Trust Ribbon */}
        {!user && (
          <div className="relative z-10 max-w-5xl mx-auto pb-16 px-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row justify-around items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">500+</p>
                <p className="text-sm text-gray-300 font-bold uppercase tracking-wider mt-1">Premium Cars</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">24/7</p>
                <p className="text-sm text-gray-300 font-bold uppercase tracking-wider mt-1">Concierge Support</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">100%</p>
                <p className="text-sm text-gray-300 font-bold uppercase tracking-wider mt-1">Fully Insured</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HOW IT WORKS SECTION */}
      {!user && (
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2">Simple Process</h2>
              <h3 className="text-4xl font-extrabold text-navy-900">How It Works</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200" style={{ left: '16.6%', right: '16.6%' }}></div>
              
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-gray-50 rounded-full shadow-xl flex items-center justify-center relative z-10 mb-6">
                  <span className="text-2xl font-extrabold text-brand-600">1</span>
                </div>
                <h4 className="text-2xl font-bold text-navy-900 mb-3">Choose a Vehicle</h4>
                <p className="text-gray-500 font-medium">Browse our premium collection and find the perfect car for your journey.</p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-brand-600 border-4 border-gray-50 rounded-full shadow-xl flex items-center justify-center relative z-10 mb-6">
                  <span className="text-2xl font-extrabold text-white">2</span>
                </div>
                <h4 className="text-2xl font-bold text-navy-900 mb-3">Select Dates</h4>
                <p className="text-gray-500 font-medium">Pick your pickup and drop-off dates through our seamless booking system.</p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-gray-50 rounded-full shadow-xl flex items-center justify-center relative z-10 mb-6">
                  <span className="text-2xl font-extrabold text-brand-600">3</span>
                </div>
                <h4 className="text-2xl font-bold text-navy-900 mb-3">Enjoy the Ride</h4>
                <p className="text-gray-500 font-medium">Pick up your keys and experience the thrill of true luxury on the road.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE FLEET COLLECTION */}
      <div className="py-24 bg-white" id="fleet">

        <div className="text-center mb-16">
          <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2">Our Collection</h2>
          <h3 className="text-4xl font-extrabold text-navy-900">The Premium Fleet</h3>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && cars.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xl text-gray-500 font-medium">No premium vehicles are currently available.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {cars.map((car) => (
                <div key={car.id} className="card-premium group overflow-hidden flex flex-col">
                  {/* IMAGE SECTION */}
                  <div className="h-64 bg-gray-100 relative overflow-hidden">
                    {user?.role === "admin" && (
                      <span className={`absolute top-4 right-4 z-10 px-3 py-1.5 text-xs font-bold rounded-lg shadow-md backdrop-blur-md ${car.is_available ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                        {car.is_available ? "AVAILABLE" : "HIDDEN"}
                      </span>
                    )}
                    {car.images && car.images.length > 0 ? (
                      <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-lg bg-gray-200">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-navy-900">{car.make} <span className="text-brand-600">{car.model}</span></h3>
                        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{car.year}</span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium tracking-wide">REG: {car.registration_number}</p>
                    </div>

                    <div className="mt-8 flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-400 font-medium mb-1">Daily Rate</p>
                        <span className="text-3xl font-extrabold text-navy-900">${car.daily_price}<span className="text-lg font-medium text-gray-400">/day</span></span>
                      </div>

                      {user?.role === "admin" ? (
                        <div className="flex space-x-3">
                          <Link to={`/admin/edit-car/${car.id}`} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors" title="Edit">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          </Link>
                          <button onClick={() => handleDelete(car.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      ) : (
                        <Link to={`/book/${car.id}`} className="btn-primary">Book Now</Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {meta && meta.last_page > 1 && (
              <div className="flex justify-center mt-16 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-navy-800 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                >
                  &larr; Prev
                </button>
                <div className="flex items-center px-6 bg-white border border-gray-100 rounded-xl shadow-sm font-bold text-brand-600">
                  {currentPage} <span className="text-gray-400 font-medium mx-1">/</span> {meta.last_page}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.last_page))}
                  disabled={currentPage === meta.last_page}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-navy-800 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>

      {/* FOOTER SECTION */}
      <footer className="bg-navy-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-extrabold text-white mb-6">Luxe<span className="text-brand-500">Ride</span></h2>
              <p className="text-gray-400 font-medium max-w-md">Experience the thrill of driving the world's most prestigious vehicles. We deliver luxury, performance, and unparalleled service directly to you.</p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 tracking-wide uppercase">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors font-medium">Home</Link></li>
                <li><a href="#fleet" className="text-gray-400 hover:text-white transition-colors font-medium">Our Fleet</a></li>
                {!user && <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors font-medium">Sign Up</Link></li>}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 tracking-wide uppercase">Contact</h3>
              <ul className="space-y-4">
                <li className="text-gray-400 font-medium">support@luxeride.com</li>
                <li className="text-gray-400 font-medium">+1 (800) 123-LUXE</li>
                <li className="text-gray-400 font-medium">123 Luxury Avenue<br/>Beverly Hills, CA 90210</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 font-medium text-sm">
              &copy; {new Date().getFullYear()} LuxeRide Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
