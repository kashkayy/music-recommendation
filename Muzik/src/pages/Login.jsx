import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../auth/AuthContext";
import { Notify } from "../utils/toast";
import { Spinner } from "react-spinner-toolkit";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: saveToken, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  async function handleLogin(user) {
    try {
      const response = await login(user);
      if (response.ok) {
        saveToken(response.token);
        navigate("/home", {
          replace: true,
        });
      } else if (response.status === 401) {
        Notify(response.message);
      } else {
        Notify(response.message);
      }
    } catch (err) {
      Notify("Login failed. Try again");
    } finally {
      setIsLoading(false);
    }
  }
  function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const user = { username, password };
    handleLogin(user);
    setUsername("");
    setPassword("");
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
      <form onSubmit={handleSubmit} id="log-in-form">
        <label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Log in</button>
      </form>
    </>
  );
}
