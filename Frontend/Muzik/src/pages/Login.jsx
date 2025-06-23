export default function Login(){
  return(
    <>
      <form>
        <label><input type="text" placeholder="Enter your username"  required/></label>
        <label><input type="text" placeholder="Password" required/></label>
        <button type="submit" id="login">Log in</button>
      </form>
      <span>Don't have an account <a id="sign-up-link">signup!</a></span>
      
    </>
  )
}