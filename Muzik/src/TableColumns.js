import { SECTIONS } from "./AdminSections";
export const tableColumns = {
  [SECTIONS.USERS]: [
    { key: "id", header: "ID" },
    { key: "role", header: "ROLE" },
    { key: "username", header: "Username" },
    { key: "createdAt", header: "Sign up Date" },
    { key: "actions", header: "Actions" },
    { key: "playlist", header: "Playlist" },
  ],
  [SECTIONS.SONGS]: [
    { key: "title", header: "Title" },
    { key: "artist", header: "Artist" },
  ],
};
