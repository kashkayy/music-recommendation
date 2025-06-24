import { useState } from "react"
import { register } from "../api.js"
import {Link, useNavigate} from "react-router-dom"
export default function SignUp(){
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  function handleCreateUser(newUser){
    register(newUser);
  }
  function handleSubmit(event){
    event.preventDefault();
    const user = {username, password}
    handleCreateUser(user)
    setUsername("")
    setPassword("")
    navigate('/auth/login', {replace: true})
  }
  return(
    <>
      <form id="sign-up-form" onSubmit={handleSubmit}>
        <label><input type="text" placeholder="Create a username" value={username} onChange={(event) => setUsername(event.target.value)} required/></label>
        <label><input type="text" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required/></label>
        <button type="submit" id="sign-up">Sign up!</button>
      </form>
      <span>Already have an account? <Link to={`/auth/login`}>log in!</Link></span>
    </>
  )
}