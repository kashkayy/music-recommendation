import AdminButtons from "./AdminActions";
import useAdmin from "../hooks/useAdmin";
import PlaylistModal from "./PlaylistModal";
export default function UserRow({ user, requester, columns, onActionClick }) {
  const { handlePlaylistView, playlistOpen, handlePlaylistClose } = useAdmin();
  return (
    <>
      <tr>
        {columns.map((column) => {
          if (column.key === "actions") {
            return (
              <td>
                <AdminButtons
                  requester={requester}
                  target={user}
                  onAction={onActionClick}
                />
              </td>
            );
          }
          if (column.key === "playlist") {
            return (
              <td>
                <button onClick={handlePlaylistView}>View</button>
                {playlistOpen && (
                  <PlaylistModal
                    userId={user.id}
                    username={user.username}
                    onClose={handlePlaylistClose}
                  ></PlaylistModal>
                )}
              </td>
            );
          }
          return <td key={column.key}>{user[column.key]}</td>;
        })}
      </tr>
    </>
  );
}
