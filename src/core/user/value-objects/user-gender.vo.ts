import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export const GENDERS = {
  male: "Male",
  female: "Female",
  unknown: "I prefer not comment about it",
} as const;

export type UserGender = string & (typeof GENDERS)[keyof typeof GENDERS] & {
  readonly __brand: unique symbol;
};

export const createUserGender = (gender: string): UserGender => {
  if (!Object.values(GENDERS).some((g) => g === gender)) {
    throw new TypeNotSatisfiedError(
      `gender must be: 'Male' or 'Female' or 'I prefer not comment about it'`,
    );
  }
  return gender as UserGender;
};
