import { getAuthHeaders } from "./utils/getHeaders";
import { Notify } from "./utils/toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export async function register(newUser) {
  const { username, password, userLat, userLng } = newUser;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, userLat, userLng }),
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
    `${BASE_URL}/auth/login/trending?lat=${lat}&lng=${lng}`
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
    }
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
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  Notify("Successfully added to favorites!");
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
  const authCheck = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/auth/admin/users`, authCheck);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function getAllSongs() {
  const authCheck = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/auth/admin/songs`, authCheck);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function getTopSongs() {
  const authCheck = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/auth/admin/top/saved-songs`, authCheck);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function getTopUsers() {
  const authCheck = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/auth/admin/top/active-users`, authCheck);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function togglePromote(userId, newRole) {
  const authCheck = getAuthHeaders("PUT", { newRole });
  const res = await fetch(
    `${BASE_URL}/auth/admin/role-promote/${userId}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  Notify("Succesful Action!");
  const data = await res.json();
  return data.results;
}
export async function toggleDemote(userId) {
  const authCheck = getAuthHeaders("PUT");
  const res = await fetch(
    `${BASE_URL}/auth/admin/role-demote/${userId}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  Notify("Successful Action!");

  const data = await res.json();
  return data.results;
}
export async function toggleBan(userId, newStatus) {
  const authCheck = getAuthHeaders("PUT", { newStatus });
  const res = await fetch(`${BASE_URL}/auth/admin/ban/${userId}`, authCheck);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  Notify("Successful Action!");
  const data = await res.json();
  return data.results;
}
export async function getUserPlaylist(userId) {
  const authCheck = getAuthHeaders();
  const res = await fetch(
    `${BASE_URL}/auth/admin/user-favorites/${userId}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function getClusters(latMin, latMax, lngMin, lngMax, zoom) {
  const authCheck = getAuthHeaders();
  const res = await fetch(
    `${BASE_URL}/auth/clusters/info?latMin=${latMin}&latMax=${latMax}&lngMin=${lngMin}&lngMax=${lngMax}&zoom=${zoom}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
export async function getClusterSongs(lat, lng, zoom) {
  const authCheck = getAuthHeaders();
  const res = await fetch(
    `${BASE_URL}/auth/clusters/songs?lat=${lat}&lng=${lng}&zoom=${zoom}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
export async function getUserRecommendation(userLat, userLng, range, userId) {
  const authCheck = getAuthHeaders();
  const res = await fetch(
    `${BASE_URL}/auth/recommendation?userLat=${userLat}&userLng=${userLng}&range=${range}&userId=${userId}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function getSvdRecommendations(userId) {
  const authCheck = getAuthHeaders();
  const res = await fetch(
    `${BASE_URL}/auth/recommendation/svd?userId=${userId}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
export async function getHybridRecommendation(userLat, userLng, range, userId) {
  const authCheck = getAuthHeaders();
  const res = await fetch(
    `${BASE_URL}/auth/recommendation/hybrid?userLat=${userLat}&userLng=${userLng}&range=${range}&userId=${userId}`,
    authCheck
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
