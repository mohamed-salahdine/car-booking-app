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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* PREMIUM FUTURISTIC HERO */}
      <div className="relative min-h-[90vh] bg-[#030712] overflow-hidden flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
           {/* deep mesh gradient / grid */}
           <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
           {/* Scanline overlay */}
           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+Cjwvc3ZnPg==')] opacity-50"></div>
           <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full pt-20">
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-6 leading-none">
            {user?.role === "admin" ? "COMMAND" : "BEYOND"} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-400 to-brand-600">
              {user?.role === "admin" ? "CENTER." : "LIMITS."}
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400 font-medium leading-relaxed">
            {user?.role === "admin" 
              ? "Monitor and manage the entire fleet through an advanced, real-time control matrix." 
              : "Experience the pinnacle of automotive engineering. Reserve your ultimate driving machine with a seamless, zero-friction interface."}
          </p>
          
          {!user && (
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register" className="group relative px-8 py-4 bg-white text-navy-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  Initialize Booking
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </Link>
              <a href="#fleet" className="px-8 py-4 rounded-2xl font-bold text-lg text-white border border-white/20 hover:bg-white/5 backdrop-blur-sm transition-all">
                View Fleet
              </a>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING STATS */}
      {!user && (
        <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-20 mb-24">
          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex flex-col md:flex-row justify-around items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-blue-500 to-brand-400"></div>
            <div className="text-center group w-full md:w-auto">
              <p className="text-4xl md:text-5xl font-black text-navy-900 group-hover:scale-110 transition-transform">500<span className="text-brand-500">+</span></p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Elite Vehicles</p>
            </div>
            <div className="hidden md:block w-px h-20 bg-gray-200"></div>
            <div className="text-center group w-full md:w-auto border-y md:border-y-0 border-gray-100 py-6 md:py-0">
              <p className="text-4xl md:text-5xl font-black text-navy-900 group-hover:scale-110 transition-transform">24<span className="text-brand-500">/7</span></p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Global Support</p>
            </div>
            <div className="hidden md:block w-px h-20 bg-gray-200"></div>
            <div className="text-center group w-full md:w-auto">
              <p className="text-4xl md:text-5xl font-black text-navy-900 group-hover:scale-110 transition-transform">100<span className="text-brand-500">%</span></p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Secure & Insured</p>
            </div>
          </div>
        </div>
      )}

      {/* FUTURISTIC PROCESS SECTION */}
      {!user && (
        <div className="py-20 relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight">Streamlined Protocol.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-100 via-blue-200 to-emerald-100 -z-10"></div>

              {/* Process Card 1 */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg group-hover:rotate-12 transition-transform">01</div>
                <h4 className="text-2xl font-bold text-navy-900 mb-4">Select Asset</h4>
                <p className="text-gray-500 font-medium leading-relaxed">Access our high-performance fleet matrix. Filter by specs, aesthetics, and capability to find your perfect match.</p>
              </div>

              {/* Process Card 2 */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden mt-0 md:mt-12">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg group-hover:rotate-12 transition-transform">02</div>
                <h4 className="text-2xl font-bold text-navy-900 mb-4">Set Parameters</h4>
                <p className="text-gray-500 font-medium leading-relaxed">Input your operational timeframe. Our automated system syncs availability instantly via secure protocols.</p>
              </div>

              {/* Process Card 3 */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden mt-0 md:mt-24">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg group-hover:rotate-12 transition-transform">03</div>
                <h4 className="text-2xl font-bold text-navy-900 mb-4">Engage Thrusters</h4>
                <p className="text-gray-500 font-medium leading-relaxed">Authentication complete. Collect your access node (keys) and experience the apex of automotive engineering.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE FLEET COLLECTION */}
      <div className="py-24 pb-32 relative bg-gray-50" id="fleet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-6xl font-black text-navy-900 tracking-tighter">The Arsenal.</h3>
          </div>

          {loading && cars.length === 0 ? (
            <div className="flex justify-center items-center py-32">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-brand-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="w-8 h-8 bg-brand-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center bg-white p-16 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-2">No Units Available</h3>
              <p className="text-gray-500 font-medium">The fleet is currently fully deployed or undergoing maintenance.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {cars.map((car) => (
                  <div key={car.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col">
                    {/* IMAGE SECTION */}
                    <div className="h-72 bg-gray-100 relative overflow-hidden">
                      {user?.role === "admin" && (
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                          <span className={`px-4 py-1.5 text-xs font-black tracking-widest uppercase rounded-full shadow-lg backdrop-blur-md border ${car.is_available ? "bg-emerald-500/90 text-white border-emerald-400" : "bg-red-500/90 text-white border-red-400"}`}>
                            {car.is_available ? "ACTIVE" : "OFFLINE"}
                          </span>
                        </div>
                      )}
                      
                      {car.images && car.images.length > 0 ? (
                        <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold tracking-widest text-sm uppercase bg-gray-200">
                          Visual Data Missing
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
                      
                      {/* Floating model overlay */}
                      <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-3xl font-black text-white leading-none tracking-tight mb-2">{car.model}</h3>
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-md border border-white/20 text-white font-bold tracking-widest uppercase text-[10px]">{car.make} // {car.year}</div>
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-8 flex-1 flex flex-col justify-between bg-white relative z-20">
                      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Authorization</p>
                          <p className="text-sm text-navy-900 font-bold bg-gray-50 px-3 py-1.5 rounded-md inline-block tracking-widest">{car.registration_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tariff / 24h</p>
                          <span className="text-4xl font-black text-navy-900 tracking-tighter">${car.daily_price}</span>
                        </div>
                      </div>

                      <div className="flex justify-end mt-auto">
                        {user?.role === "admin" ? (
                          <div className="flex w-full gap-3">
                            <Link to={`/admin/edit-car/${car.id}`} className="flex-1 flex justify-center items-center gap-2 py-4 bg-navy-50 hover:bg-navy-900 text-navy-900 hover:text-white rounded-2xl font-bold transition-colors">
                              Modify Spec
                            </Link>
                            <button onClick={() => handleDelete(car.id)} className="w-14 h-14 flex justify-center items-center bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-2xl transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        ) : (
                          <Link to={`/book/${car.id}`} className="w-full flex justify-between items-center px-6 py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-brand-600 transition-colors group/btn">
                            <span className="tracking-wide">Request Deployment</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:translate-x-2 transition-transform">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {meta && meta.last_page > 1 && (
                <div className="flex justify-center mt-20 space-x-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-14 h-14 flex items-center justify-center bg-white border border-gray-200 text-navy-900 rounded-2xl shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500 hover:text-brand-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <div className="flex items-center px-8 bg-navy-900 text-white rounded-2xl shadow-lg font-black tracking-widest text-lg">
                    {currentPage} <span className="text-white/30 mx-3">/</span> {meta.last_page}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.last_page))}
                    disabled={currentPage === meta.last_page}
                    className="w-14 h-14 flex items-center justify-center bg-white border border-gray-200 text-navy-900 rounded-2xl shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500 hover:text-brand-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <footer className="bg-navy-900 border-t border-gray-800 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-[#050b14] opacity-90 z-0"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
              <Link to="/" className="flex items-center gap-3 group mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl border border-white/10 group-hover:shadow-[0_0_20px_rgba(13,148,136,0.3)] transition-all duration-300">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-300"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xl font-black tracking-tight text-white leading-none flex items-center">
                    AURA<span className="text-brand-500">DRIVE</span>
                  </span>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-gray-400 uppercase mt-1">Luxury Mobility</span>
                </div>
              </Link>
              <p className="text-gray-400 font-medium leading-relaxed max-w-sm mb-8">
                Experience the thrill of driving the world's most prestigious vehicles. We deliver uncompromising luxury, exhilarating performance, and unparalleled service directly to you.
              </p>
              <div className="flex gap-4">
                {/* Social Icons */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white hover:border-brand-500 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white hover:border-brand-500 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2 lg:col-span-2 lg:col-start-6">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-brand-400 transition-colors font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-600/50"></span> Home</Link></li>
                <li><a href="#fleet" className="text-gray-400 hover:text-brand-400 transition-colors font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-600/50"></span> Our Fleet</a></li>
                {!user && <li><Link to="/register" className="text-gray-400 hover:text-brand-400 transition-colors font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-600/50"></span> Join Now</Link></li>}
              </ul>
            </div>

            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-colors font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-600/50"></span> Chauffeur</a></li>
                <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-colors font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-600/50"></span> Airport Transfer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-colors font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-600/50"></span> Event Rentals</a></li>
              </ul>
            </div>

            <div className="md:col-span-3 lg:col-span-3">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-brand-500 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="text-gray-400 font-medium text-sm">concierge@auradrive.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-brand-500 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <span className="text-gray-400 font-medium text-sm">+1 (800) 555-AURA</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-brand-500 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <span className="text-gray-400 font-medium text-sm">100 Premium Way<br/>Silicon Valley, CA 94025</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 font-medium text-sm">
              &copy; {new Date().getFullYear()} AuraDrive Mobility. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-sm text-gray-500 hover:text-brand-400 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-brand-400 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-brand-400 transition-colors font-medium">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
