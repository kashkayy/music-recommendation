import { getToken } from "../api";
export function getAuthHeaders(){
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};