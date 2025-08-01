import { useState, useEffect } from "react";
import { register } from "../api.js";
import { Link, useNavigate } from "react-router-dom";
import { Notify } from "../utils/toast.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { Spinner } from "react-spinner-toolkit";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import usePassword from "../hooks/usePassword.jsx";
export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    showPassword,
    handlePasswordVisibility,
    showConfirmPassword,
    handleConfirm,
    handleCheckPassword,
    passwordsMatch,
    handleUsername,
    handleValidatePassword,
    validPassword,
  } = usePassword();
  const minLength = 8;
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
          fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${
              import.meta.env.VITE_IP_API_KEY
            }`
          )
            .then((response) => response.json())
            .then((data) => {
              setUserLat(Number(data.latitude));
              setUserLng(Number(data.longitude));
            })
            .catch((error) => {
              setError(error.message);
            });
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }

    handleCheckPassword(password, confirmPassword);
    handleValidatePassword(password, minLength);

    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate, password, confirmPassword, validPassword]);

  async function handleCreateUser(newUser) {
    try {
      const response = await register(newUser);
      if (response.ok) {
        navigate("/auth/login", { state: { username: newUser.username } });
      } else {
        Notify("Username already exists");
      }
    } catch (err) {
      Notify("Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const usernameIsValid = handleUsername(username);
    const passwordIsValid = handleValidatePassword(password, minLength);
    if (password !== confirmPassword) {
      Notify("Passwords do not match");
      return;
    } else if (!usernameIsValid) {
      Notify("Username can't be empty!");
      return;
    } else if (!passwordIsValid) {
      Notify("Current password does not meet requirements!");
      return;
    }
    setIsLoading(true);
    const user = { username, password, userLat, userLng };
    handleCreateUser(user);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  if (isLoading) {
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
      <h1>Sound Map 🎵</h1>
      <form id="sign-up-form" onSubmit={(event) => handleSubmit(event)}>
        <label>
          <input
            type="text"
            placeholder="Create a username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label className="password">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className="toggle-password" onClick={handlePasswordVisibility}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </label>
        {!validPassword && (
          <p className="error-msg">{`Password must be at least ${minLength} characters!`}</p>
        )}
        <label className="password">
          <input
            className={!passwordsMatch ? "error" : ""}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <div className="toggle-password" onClick={handleConfirm}>
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </label>
        {confirmPassword && !passwordsMatch && (
          <p className="error-msg">Passwords do not match !</p>
        )}
        <button type="submit">Sign up!</button>
      </form>
      <span>
        Already have an account? <Link to={`/auth/login`}>log in!</Link>
      </span>
    </>
  );
}
