import { Role } from "../generated/prisma/index.js";
export function canPromote(reqRole, userRole, reqRegion, userRegion, newRole) {
  const globalToRegion =
    reqRole === Role.admin &&
    userRole === Role.user &&
    newRole === Role.regionAdmin;

  if (globalToRegion) return true;
  //bool true represents whether global admin can promote user to region admin
  const regionToRegion =
    reqRole === Role.regionAdmin &&
    userRole === Role.user &&
    newRole === Role.regionAdmin &&
    reqRegion === userRegion;

  if (regionToRegion) {
    return true;
    // bool true represents whether region admin can promote user to region admin WITHIN the same region
  }

  return false;
}
export function canDemote(reqRole, userRole) {
  if (reqRole === Role.admin) {
    return userRole !== Role.admin;
  }
  return false;
}
