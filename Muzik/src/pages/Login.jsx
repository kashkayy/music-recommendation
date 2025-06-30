import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
export default function Login(){
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  async function handleLogin(user){
    try{
      const response = await login(user);
      if(response.ok){
        navigate('/locations', {replace: true, state : {username: user.username}})
      }else{
        alert("Incorrect username or password")
      }
    }catch(err){
      alert("Login failed. Try again")
    }
  }
  function handleSubmit(event){
    event.preventDefault();
    const user = {username, password}
    handleLogin(user)
    setUsername("")
    setPassword("")
  }
  return(
    <>
      <h1>Sound Map 🎵</h1>
      <form onSubmit={handleSubmit} id="log-in-form">
        <label><input type="text" placeholder="Enter your username" value={username} onChange={(event) => setUsername(event.target.value)} required/></label>
        <label><input type="text" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)}  required/></label>
        <button type="submit">Log in</button>
      </form>
    </>
  )
}