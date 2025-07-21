import AdminButtons from "./AdminActions";
export default function UserRow({ user, requester, columns }) {
  return (
    <>
      <tr>
        {columns.map((column) => {
          if (column.key === "actions") {
            return (
              <td>
                <AdminButtons requester={requester} target={user} />
              </td>
            );
          }
          return <td key={column.key}>{user[column.key]}</td>;
        })}
      </tr>
    </>
  );
}
