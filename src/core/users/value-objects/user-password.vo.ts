import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";
import { passwordsConfig } from "~/config/hash/argon2.hash";

export type UserPassword = string & { readonly __brand: unique symbol };

export const createUserPassword = async (password: unknown): Promise<UserPassword> => {
  const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,255}$/;
  if( typeof password !== 'string' )
    throw new TypeNotSatisfiedError(`password must be a string`);
  if (!regexPassword.test(password)) {
    throw new TypeNotSatisfiedError(
      `password must have letters, numbers, and over 7 characters`,
    );
  }
  const hashedPassword = await passwordsConfig.hash(password)

  return hashedPassword as UserPassword;
};
