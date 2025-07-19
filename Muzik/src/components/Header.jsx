import { useAuth } from "../auth/AuthContext";
import { isAdmin } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Notify } from "../utils/toast";
import { Spinner } from "react-spinner-toolkit";
export default function Header({ setCurrentSection }) {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { logout } = useAuth();
  function handleLogOut() {
    logout();
  }
  useEffect(() => {
    async function handlePermission() {
      try {
        const result = await isAdmin();
        setIsUserAdmin(result);
      } catch (error) {
        Notify();
      } finally {
        setIsLoaded(true);
      }
    }
    handlePermission();
  }, []);
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
    <>
      <header>
        <h1>Sound Map 🎵</h1>
        <div className="nav-btns">
          <button onClick={() => setCurrentSection("home")}>Home</button>
          <button onClick={() => setCurrentSection("map")}>Map</button>
          {isUserAdmin && (
            <div className="link-container">
              <Link to={"/admin/dashboard"} className="link">
                <span>Admin</span>
              </Link>
            </div>
          )}
        </div>
        <button onClick={() => handleLogOut()}>Logout</button>
      </header>
    </>
  );
}
