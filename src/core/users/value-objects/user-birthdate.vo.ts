import { Temporal } from "temporal-polyfill";
import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export type UserBirthday = Temporal.PlainDate & { readonly __brand: unique symbol };

export const createUserBirthday = (date: unknown): UserBirthday => {
  if (typeof date !== 'string') {
    throw new TypeNotSatisfiedError(`date must be a string`);
  }
  const newDate = Temporal.PlainDate.from(date as string, {overflow: 'reject'});
  if( !(newDate.year > 1905 && newDate.year < 2010)  )
    throw new TypeNotSatisfiedError(`date's years must be between year 1905 and 2010`);
  
  return newDate as UserBirthday;
};
