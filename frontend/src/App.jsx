// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// We will create these pages in the next step, for now, we use simple placeholders
const Home = () => (
  <div className="p-8 text-2xl font-bold">Home Page (Public)</div>
);
const Login = () => <div className="p-8 text-2xl font-bold">Login Page</div>;
const CustomerDashboard = () => (
  <div className="p-8 text-2xl font-bold text-green-600">
    Customer Dashboard
  </div>
);
const AdminDashboard = () => (
  <div className="p-8 text-2xl font-bold text-red-600">Admin Dashboard</div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Optional: Add a Navbar here later */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Customers & Admins) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
