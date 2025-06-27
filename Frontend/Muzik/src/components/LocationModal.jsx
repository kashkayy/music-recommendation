import { useState } from "react"
export default function MarkerModal({marker, onClose}){
  
  return(
    <>
      <div className="modal">
        <div className="modal-content-container">
          <button className="close-btn" onClick={onClose}>X</button>
          <div className="modal-content">
            <h2><strong>What's trending in {marker.name}</strong></h2>
          </div>
        </div>
      </div>
    </>
  )
}