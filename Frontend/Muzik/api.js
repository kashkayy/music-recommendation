const BASE_URL = "http://localhost:5500"
export async function register(){
  const res = await fetch(`${BASE_URL}/auth/register`, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify()})
  const data = await res.json()
  return data
}