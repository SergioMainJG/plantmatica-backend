import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserEmail = string & { readonly __brand: unique symbol };

export const createUserEmail = (email: string): UserEmail => {
  const regexEmail =
    /^[a-zA-Z0-9!#\$%&\/\(\)\?¿\\\.\-]{5,}@[A-Za-z0-9]{3,}\.[a-z]{2,}$/;
  if (typeof email !== "string") throw new TypeNotSatisfiedError(`email must be an string`);
  if (!regexEmail.test(email)) {
    throw new TypeNotSatisfiedError(
      `email is not a valid email: at least 5 chars in username, at least 5 letters/numbers in domain, at least 2 letters in extension `,
    );
  }
  return email as UserEmail;
};
