import { useState, useEffect } from "react";
import { register } from "../api.js";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
      });
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);
  async function handleCreateUser(newUser) {
    try {
      const response = await register(newUser);
      if (response.ok) {
        navigate("/auth/login", { state: { username: newUser.username } });
      } else {
        alert("Username already exists");
      }
    } catch (err) {
      alert("Sign up failed");
    }
  }
  function handleSubmit(event) {
    event.preventDefault();
    const user = { username, password, userLat, userLng };
    handleCreateUser(user);
    setUsername("");
    setPassword("");
    if (error) alert(error);
  }
  return (
    <>
      <h1>Sound Map 🎵</h1>
      <form id="sign-up-form" onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder="Create a username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Sign up!</button>
      </form>
      <span>
        Already have an account? <Link to={`/auth/login`}>log in!</Link>
      </span>
    </>
  );
}
