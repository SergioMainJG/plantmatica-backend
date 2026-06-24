import { Temporal } from "temporal-polyfill";
import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserBirthday = Temporal.PlainDate & { readonly __brand: unique symbol };
export const currentYear = Temporal.Now.plainDateISO();
const minimumYearForUsers = currentYear.year - 18;
const maximunYearForUsers = currentYear.year - 120;

export const createUserBirthday = (date: unknown): UserBirthday => {
  if (typeof date !== 'string') {
    throw new TypeNotSatisfiedError(`date must be a string`);
  }
  const newDate = Temporal.PlainDate.from(date as string, { overflow: 'reject' });
  if (!(newDate.year > maximunYearForUsers && newDate.year < minimumYearForUsers))
    throw new TypeNotSatisfiedError(`date's years must be between year ${maximunYearForUsers} and ${minimumYearForUsers}`);

  return newDate as UserBirthday;
};
