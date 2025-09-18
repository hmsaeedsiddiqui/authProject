import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, 
  });

  // Load user on page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", userData);
      if (res.data.user && res.data.token) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);

        toast.success("Signup successful!"); 


        if (res.data.user.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!"); 
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);
      if (res.data.user && res.data.token) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);

        toast.success("Login successful!");

        // Redirect based on role
        if (res.data.user.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials!"); 
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.info("Logged out successfully!"); 
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
