import { useState } from "react"
import { register } from "../api.js"
import {Link, useNavigate} from "react-router-dom"
export default function SignUp(){
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  async function handleCreateUser(newUser){
    try{
      const response = await register(newUser);
      if(response.success){
        navigate('/locations', {state : {username: newUser.username}})
      }else{
        alert("Username already exists")
      }
        }catch(err){
          alert("Sign up failed")
        }
  }
  function handleSubmit(event){
    event.preventDefault();
    const user = {username, password}
    handleCreateUser(user)
    setUsername("")
    setPassword("")
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