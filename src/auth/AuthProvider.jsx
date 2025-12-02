import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // LOGIN
  // -------------------------
  const login = (userData, token) => {
    const normalizedUser = {
      ...userData,
      _id: userData._id || userData.id,
      role: userData.role || "user",
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);

    setUser(normalizedUser);
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // -------------------------
  // LOAD USER ON REFRESH
  // -------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          _id: parsedUser._id || parsedUser.id,
        });
      } catch {
        logout();
      }
    }

    setLoading(false);
  }, []);

  // -------------------------
  // GLOBAL AUTH STATE
  // -------------------------
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
