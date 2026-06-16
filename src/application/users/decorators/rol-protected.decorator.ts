import { SetMetadata } from "@nestjs/common";
import { UserRol } from "~/core/users/value-objects/user-rol.vo";


export const META_ROLS = 'rols';


export const RolProtected = (...args: UserRol[]) => {
  return SetMetadata(META_ROLS, args);
}