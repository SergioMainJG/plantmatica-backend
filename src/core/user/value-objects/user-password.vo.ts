import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserPassword = string & { readonly __brand: unique symbol };

export const createUserPassword = (password: string): UserPassword => {
  const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,255}$/;
  if (!regexPassword.test(password)) {
    throw new TypeNotSatisfiedError(
      `password must have letters, numbers, and over 7 characters`,
    );
  }
  return password as UserPassword;
};
