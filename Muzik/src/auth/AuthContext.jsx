import { createContext, useContext, useState, useEffect } from "react";
import { getToken, isAdmin } from "../api";
import { Spinner } from "react-spinner-toolkit";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [adminStatus, setAdminStatus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
  const isAuthenticated = !!token;
  async function checkAdmin() {
    try {
      const result = await isAdmin();
      return result;
    } catch (error) {
      return false;
    }
  }
  useEffect(() => {
    async function verifyAdmin() {
      if (isAuthenticated) {
        const result = await checkAdmin();
        setAdminStatus(result);
      } else {
        setAdminStatus(false);
      }
      setIsLoaded(true);
    }
    verifyAdmin();
  }, [isAuthenticated]);
  if (!isLoaded) {
    return (
      <div className="loading-container">
        <Spinner
          shape="threeDots"
          color="#888"
          loading
          speed={1}
          size={300}
          transition={true}
        />
      </div>
    );
  }
  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, token, adminStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
