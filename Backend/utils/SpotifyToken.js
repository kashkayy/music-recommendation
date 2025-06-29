import dotenv from 'dotenv';
dotenv.config();
export async function getSpotifyToken(){
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(
    'https://accounts.spotify.com/api/token',
     {method: "POST",
      headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type" : 'application/x-www-form-urlencoded'
      },
      body:"grant_type=client_credentials"
    })
    const data = await response.json()
    return data.access_token
  }