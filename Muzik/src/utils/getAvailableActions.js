import { canPerformAction, PERMISSIONS } from "../AdminSections";
export function getAvailableActions(requester, target) {
  const results = [];
  Object.keys(PERMISSIONS).forEach((action) => {
    if (canPerformAction(action, requester, target)) {
      if (action === "ban" && target.isBanned) {
        results.push("unban");
      } else if (action !== "ban" || !target.isBanned) {
        results.push(action);
      }
    }
  });
  return results;
}
