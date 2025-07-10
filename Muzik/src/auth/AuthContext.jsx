import { createContext, useContext, useState } from "react";
import { getToken } from "../api";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
  const isAuthenticated = !!token;
  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
