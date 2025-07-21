import { canPerformAction, PERMISSIONS } from "../AdminSections";
export function getAvailableActions(requester, target) {
  const results = Object.keys(PERMISSIONS).filter((action) =>
    canPerformAction(action, requester, target)
  );
  return results;
}
