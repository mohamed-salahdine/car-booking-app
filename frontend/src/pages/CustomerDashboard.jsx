import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 mb-6 md:mb-0">Manage your bookings, explore new cars, or update your profile.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow">
            Browse Cars
          </Link>
          <Link to="/dashboard/bookings" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition border border-gray-200">
            View Bookings
          </Link>
        </div>
      </div>

      {/* Quick Links / Featured Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <Link to="/dashboard/bookings" className="group bg-white p-6 rounded-xl shadow border border-gray-100 hover:border-blue-300 transition block">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">My Bookings &rarr;</h2>
          <p className="text-gray-500 mt-2">View your upcoming, active, and past rentals.</p>
        </Link>
        
        <Link to="/dashboard/profile" className="group bg-white p-6 rounded-xl shadow border border-gray-100 hover:border-purple-300 transition block">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition">Profile Settings &rarr;</h2>
          <p className="text-gray-500 mt-2">Update your personal details and change your password.</p>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
