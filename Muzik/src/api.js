const BASE_URL = import.meta.env.VITE_BASE_URL
export async function register(newUser){
  const {username, password} = newUser
  const res = await fetch(`${BASE_URL}/auth/signup`, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({username, password})})
  const data = await res.json()
  return data
}
export async function login(user){
  const {username, password} = user
  const res = await fetch(`${BASE_URL}/auth/login`, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({username, password})})
  const data = await res.json()
  localStorage.setItem("token", data.token)
  return data
}
export const token = localStorage.getItem("token")
export async function getTrendingSongs(lat,lng){
  const res = await fetch(`${BASE_URL}/auth/login/trending?lat=${lat}&lng=${lng}`)
  const data = await res.json()
  return data
}
export async function getSearchResults(query){
  const encodedQuery = encodeURIComponent(query)
  const res = await fetch(`${BASE_URL}/auth/search?query=${encodedQuery}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
  }, })
  const data = await res.json()
  return data
}
export async function getUserFavorites(){
  const res = await fetch(`${BASE_URL}/auth/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
  }, })
  const data = await res.json()
  return data
}
