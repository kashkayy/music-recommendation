import AdminButtons from "./AdminActions";
export default function UserRow({ user, requester, columns, onActionClick }) {
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
          return <td key={column.key}>{user[column.key]}</td>;
        })}
      </tr>
    </>
  );
}
