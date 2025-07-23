import { createContext, useContext, useState, useEffect } from "react";
import { getToken, isAdmin } from "../api";
import { Spinner } from "react-spinner-toolkit";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [adminStatus, setAdminStatus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [region, setRegion] = useState(null);
  const [user, setUser] = useState({});
  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
  const isExpired = isTokenExpired(token);
  const isAuthenticated = !!token && !isExpired;
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
    async function getUserRegion() {
      if (!token) {
        setRegion(null);
      }
      try {
        const decoded = jwtDecode(token);
        setRegion(decoded.region);
      } catch (error) {
        setRegion(null);
      }
    }
    getUserRegion();
    async function getUser() {
      if (!token) {
        setUser(null);
      }
      try {
        const requester = jwtDecode(token);
        setUser(requester);
      } catch (error) {
        setUser(null);
      }
    }
    getUser();
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
      value={{
        login,
        logout,
        isAuthenticated,
        token,
        adminStatus,
        region,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
