const BASE_URL = "http://localhost:5200"
export async function register(newUser){
  const {username, password} = newUser
  const res = await fetch(`${BASE_URL}/auth/signup`, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(username, password)})
  const data = await res.json()
  return data
}