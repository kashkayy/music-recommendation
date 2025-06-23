export default function SignUp(){
  return(
    <>
      <form>
        <label><input type="text" placeholder="Enter your email" required/></label>
        <label><input type="text" placeholder="Create a username"  required/></label>
        <label><input type="text" placeholder="Create a password" required/></label>
        <button type="submit" id="login">Log in</button>
      </form>
    </>
  )
}