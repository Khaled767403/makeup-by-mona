import { createContext, useContext, useEffect, useState } from "react";
import { adminApi } from "../api/admin.api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "mona_admin_token";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .me()
      .then((data) => setAdmin(data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const { token, admin: adminData } = await adminApi.login(username, password);
    localStorage.setItem(TOKEN_KEY, token);
    setAdmin(adminData);
    return adminData;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
