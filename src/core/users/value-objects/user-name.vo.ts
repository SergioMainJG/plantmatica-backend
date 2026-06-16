import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserName = string & { readonly __brand: unique symbol };

export const createUserName = (name: unknown): UserName => {
  if (typeof name !== "string") {
    throw new TypeNotSatisfiedError(`name must be an string`);
  }
  if (name.length < 5 || name.length > 50) {
    throw new TypeNotSatisfiedError(`name must be over 5 letters and under 50`);
  }
  return name as UserName;
};
