import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserName = string & { readonly __brand: unique symbol };

export const createUserName = (name: string): UserName => {
  if (typeof name !== "string") {
    throw new TypeNotSatisfiedError(`name must be an string`);
  }
  if (name.length < 5 || name.length > 20) {
    throw new TypeNotSatisfiedError(`name must be over 5 letters and under 20`);
  }
  return name as UserName;
};
