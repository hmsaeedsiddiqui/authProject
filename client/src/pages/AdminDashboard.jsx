import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) navigate("/"); // Redirect if not admin
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen flex items-center bg-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, Admin {user.name || user.fullname} 🎉
        </h1>
        <p className="text-purple-600 font-medium mb-6">
          You have <strong>Admin</strong> access.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
