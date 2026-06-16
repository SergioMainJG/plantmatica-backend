import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export const ROLS = {
  admin: "Administrador",
  user: "Usuario",
} as const;
export type UserRol = string & (typeof ROLS)[keyof typeof ROLS] & {
  readonly __brand: unique symbol;
};

export const createUserRol = (rol: unknown): UserRol => {
  if (typeof rol !== "string") {
    throw new TypeNotSatisfiedError(`rol must be a string`);
  }
  if (!Object.values(ROLS).some((r) => r === rol)) {
    throw new TypeNotSatisfiedError(
      `rol must be just 'Administrador' and 'Usuario'`,
    );
  }
  return rol as UserRol;
};
