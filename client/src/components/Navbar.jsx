import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        AuthApp
      </Link>

      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link
              to="/signup"
              className="text-blue-500 font-medium hover:text-blue-600 transition"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            {user.isAdmin ? (
              <Link
                to="/admin-dashboard"
                className="text-blue-500 font-medium hover:text-blue-600 transition"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/user-dashboard"
                className="text-blue-500 font-medium hover:text-blue-600 transition"
              >
                User Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
