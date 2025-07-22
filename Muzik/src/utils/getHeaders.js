import { getToken } from "../api";
export function getAuthHeaders(param = "GET", item = null) {
  const token = getToken();
  const baseHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if ((param === "PUT" || param === "POST") && item !== null) {
    return {
      method: param,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
  }
  return {
    method: param,
    ...baseHeaders,
  };
}
