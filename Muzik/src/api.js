import { getAuthHeaders } from "./utils/getHeaders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export async function register(newUser) {
  const { username, password } = newUser;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  return data;
}
export async function login(user) {
  const { username, password } = user;
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  return data;
}
export function getToken() {
  return localStorage.getItem("token");
}
export async function getTrendingSongs(lat, lng) {
  const res = await fetch(
    `${BASE_URL}/auth/login/trending?lat=${lat}&lng=${lng}`,
  );
  const data = await res.json();
  return data;
}
export async function getSearchResults(query) {
  const token = getToken();
  const encodedQuery = encodeURIComponent(query);
  const res = await fetch(`${BASE_URL}/auth/search?query=${encodedQuery}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
}
export async function getUserFavorites() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
}
export async function deleteSavedSong(songId, lat, lng) {
  const token = getToken();
  const res = await fetch(
    `${BASE_URL}/auth/favorites/delete?songId=${songId}&lat=${lat}&lng=${lng}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await res.json();
  return data;
}
export async function saveSong(songId, lat, lng, title, artist, coverUrl) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/favorites/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ songId, lat, lng, title, artist, coverUrl }),
  });
  const data = await res.json();
  return data;
}
export async function isAdmin() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.isAdmin;
}
export async function getAllUsers() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.results;
}
export async function getAllSongs() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin/songs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.results;
}
export async function getTopSongs() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin/top/songs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.results;
}
export async function getTopUsers() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin/top/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.results;
}
export async function toggleAdmin(userId) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin/${userId}/role-action`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.results;
}
export async function toggleBan(userId) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/admin/${userId}/ban-action`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.results;
}
export async function getClusters(latMin, latMax, lngMin, lngMax, zoom) {
  const authCheck = getAuthHeaders()
  const res = await fetch(`${BASE_URL}/auth/clusters/info?latMin=${latMin}&latMax=${latMax}&lngMin=${lngMin}&lngMax=${lngMax}&zoom=${zoom}`, authCheck)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json()
  return data
}
export async function getClusterSongs(lat, lng, zoom) {
  const authCheck = getAuthHeaders()
  const res = await fetch(`${BASE_URL}/auth/clusters/songs?lat=${lat}&lng=${lng}&zoom=${zoom}`, authCheck)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json()
  return data
}
