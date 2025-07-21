export default function PendingModal({ action, target, onClose }) {
  return (
    <>
      <div className="modal-overlay">
        <div className="admin-modal-content-container">
          <h2>
            {" "}
            Are you sure you want to{" "}
            <strong>
              {action} {target.username} ?
            </strong>
          </h2>
          <div className="confirmation-buttons">
            <button onClick={onClose}>No</button>
            <button>Yes</button>
          </div>
        </div>
      </div>
    </>
  );
}
