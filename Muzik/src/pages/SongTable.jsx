import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
export default function SongTable({ columns, data }) {
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
              <tr key={row.song.id}>
                {columns.map((column) => (
                  <td key={column.key}>{row.song[column.key]}</td>
                ))}
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
