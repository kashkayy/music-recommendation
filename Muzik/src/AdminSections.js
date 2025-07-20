export const SECTIONS = {
  DASHBOARD: "Dashboard",
  USERS: "Users",
  SONGS: "Songs",
};
export const ROLE = {
  globalAdmin: "global-admin",
  regionAdmin: "region-admin",
  user: "user",
};

export const PERMISSIONS = {
  promote: {
    [ROLE.globalAdmin]: [ROLE.user, ROLE.regionAdmin],
    [ROLE.regionAdmin]: [ROLE.user],
  },
  demote: {
    [ROLE.globalAdmin]: [ROLE.regionAdmin],
  },
  ban: {
    [ROLE.globalAdmin]: [ROLE.user],
    [ROLE.regionAdmin]: [ROLE.user],
  },
};
export const ACTIONS = {
  promote: "Promote ⬆️",
  demote: "Demote ⬇️",
  ban: "Ban ❗️",
};
export function canPerformAction({ action, requester, target }) {
  const allowedTargets = PERMISSIONS[action]?.[requester.role];
  if (!allowedTargets) return false;
  const sameRegion = requester.region === target.region;
  return (
    allowedTargets.includes(target.role) &&
    (requester.role === ROLE.globalAdmin || sameRegion)
  );
}
