import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl border border-gray-200 p-10 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            {user ? `Welcome, ${user.name || user.fullname}` : "Welcome Guest"}
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            {!user
              ? "Please signup or login to continue using the app."
              : user.isAdmin
              ? "You are logged in as Admin."
              : "You are logged in as User."}
          </p>

          {!user ? (
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Login
              </Link>
            </div>
          ) : user.isAdmin ? (
            <Link
              to="/admin-dashboard"
              className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition"
            >
              Go to Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/user-dashboard"
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
            >
              Go to User Dashboard
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
