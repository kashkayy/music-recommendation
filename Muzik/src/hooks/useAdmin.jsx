import { useCallback, useState } from "react";
export default function useAdmin() {
  const [pendingAction, setPendingAction] = useState(null);
  //This function uses pendingAction state to store current action to be performed as well as target info into an object
  const handleActionClick = useCallback((action, target) => {
    setPendingAction({ action, user: target });
  }, []);

  const handleClose = useCallback(() => {
    setPendingAction(null);
  }, []);
  return { handleActionClick, pendingAction, handleClose };
}
