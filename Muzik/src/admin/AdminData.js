import { SECTIONS } from "./AdminSections";
import { getAllUsers, getAllSongs } from "../api";
export async function fetchData(section) {
  switch (section) {
    case SECTIONS.USERS:
      return await getAllUsers();
    case SECTIONS.SONGS:
      return await getAllSongs();
    case SECTIONS.DASHBOARD:
    default:
      return [];
  }
}
