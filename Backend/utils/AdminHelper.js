import { Role } from "../generated/prisma/index.js";
export function canPromote(reqRole, userRole, newRole) {
  const globalToRegion =
    reqRole === Role.admin &&
    userRole === Role.user &&
    newRole === Role.regionAdmin;

  if (globalToRegion) return true;
  //bool true represents whether global admin can promote user to region admin
  return false;
}
export function canDemote(reqRole, userRole) {
  return reqRole === Role.admin && userRole !== Role.admin;
}
