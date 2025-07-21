import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import UserRow from "../components/UserRows.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import PendingModal from "../components/PendingActionModal.jsx";
import useAdmin from "../hooks/useAdmin.jsx";
export default function UserTable({ columns, data }) {
  const { user } = useAuth();
  const { handleActionClick, pendingAction, handleClose } = useAdmin();
  const requester = user;
  const [currPage, setCurrPage] = useState(1);
  const rows = 20;
  let startIndex = (currPage - 1) * rows;
  let endIndex = startIndex + rows;
  const totalPages = Math.ceil(data.length / rows);
  function handlePrevClick() {
    setCurrPage((prev) => prev - 1);
  }
  function handleNextClick() {
    setCurrPage((prev) => prev + 1);
  }
  return (
    <>
      <div className="data-page">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(startIndex, endIndex).map((row) => (
              <UserRow
                key={row.id}
                user={row}
                columns={columns}
                requester={requester}
                //passes the callback function down as a prop
                onActionClick={handleActionClick}
              />
            ))}
          </tbody>
        </table>
        <div className="page-control">
          {currPage > 1 && (
            <FaAngleLeft
              className="next"
              onClick={handlePrevClick}
            ></FaAngleLeft>
          )}
          {endIndex < data.length && (
            <FaAngleRight
              className="prev"
              onClick={handleNextClick}
            ></FaAngleRight>
          )}
        </div>
        {pendingAction?.user && (
          <PendingModal
            action={pendingAction.action}
            target={pendingAction.user}
            onClose={handleClose}
          />
        )}
        <span>{`Page ${currPage} of ${totalPages}`}</span>
      </div>
    </>
  );
}
