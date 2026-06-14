import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserAge = number & { readonly __brand: unique symbol };

export const createUserAge = (age: number): UserAge => {
  if (typeof age !== "number") {
    throw new TypeNotSatisfiedError(`age must be a number`);
  }
  if (!Number.isSafeInteger(age)) {
    throw new TypeNotSatisfiedError(`age must be an integer`);
  }
  if (age > 120 || age < 12) {
    throw new TypeNotSatisfiedError(
      `age must be over 11 years and under 121 years`,
    );
  }
  return age as UserAge;
};
