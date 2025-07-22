import useAdmin from "../hooks/useAdmin";
import { Spinner } from "react-spinner-toolkit";
export default function PendingModal({ action, target, onClose, onConfirm }) {
  const { isLoading } = useAdmin();
  return (
    <>
      <div className="modal-overlay">
        {isLoading && (
          <div className="loading-container">
            <Spinner
              shape="threeDots"
              color="#888"
              loading
              speed={1}
              size={300}
              transition={true}
            />
          </div>
        )}
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
            <button
              onClick={() => onConfirm(action, target)}
              disabled={isLoading}
            >
              {isLoading ? `Processing...` : `Yes`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
