import { boolean, pgEnum, pgTable, uuid, varchar, date, text } from "drizzle-orm/pg-core";
import { GENDERS } from "~/core/users/value-objects/user-gender.vo";
import { MEXICO_STATES } from "~/core/users/value-objects/user-residence-state.vo";
import { ROLS } from "~/core/users/value-objects/user-rol.vo";

export const gendersEnum = pgEnum('GENDER', Object.values(GENDERS) as [string, ...string[]]);
export const residencesStatesEnum = pgEnum('RESIDENCES_STATES', Object.values(MEXICO_STATES) as [string, ...string[]])
export const rolsEnum = pgEnum('ROLS', Object.values(ROLS) as [string, ...string[]]);

export const UsersTable = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  birthdate: date().notNull(),
  email: varchar({ length: 50 }).notNull().unique(),
  gender: gendersEnum().notNull(),
  isVerified: boolean().notNull().default(false),
  name: varchar({ length: 20 }).notNull().unique(),
  password: text().notNull(),
  residenceState: residencesStatesEnum().notNull().default(MEXICO_STATES.outside),
  rol: rolsEnum().notNull().default(ROLS.user),
  isAgeAllowed: boolean().notNull().default(false),
});
