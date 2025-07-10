import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { ROLE } from "../AdminSections.js";
export default function DataTable({ columns, data, toggleAdmin, toggleBan }) {
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
              <tr key={row.id}>
                {columns.map((column) =>
                  column.key === "actions" ? (
                    <td key="actions">
                      <button onClick={() => toggleAdmin(row.id)}>
                        {row.role === ROLE.admin
                          ? "Revoke Admin"
                          : "Make Admin"}
                      </button>
                      <button onClick={() => toggleBan(row.id)}>
                        {row.isBanned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  ) : (
                    <td key={column.key}>{row[column.key]}</td>
                  ),
                )}
              </tr>
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
        <span>{`Page ${currPage} of ${totalPages}`}</span>
      </div>
    </>
  );
}
