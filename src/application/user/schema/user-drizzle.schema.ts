import { boolean, integer, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { GENDERS } from "~/core/user/value-objects/user-gender.vo";
import { MEXICO_STATES } from "~/core/user/value-objects/user-residence-state.vo";
import { ROLS } from "~/core/user/value-objects/user-rol.vo";

export const gendersEnum = pgEnum('GENDER', Object.values(GENDERS) as [string, ...string[]] );
export const residencesStatesEnum = pgEnum('RESIDENCES_STATES', Object.values( MEXICO_STATES ) as [string, ...string[]] )
export const rolsEnum = pgEnum('ROLS', Object.values(ROLS) as [string, ...string[]]);

export const UsersTable = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  age: integer().notNull(),
  email: varchar({length:50}).notNull().unique(),
  gender: gendersEnum().notNull(),
  isVerified: boolean().notNull().default( false ),
  name: varchar({length:20}).notNull(),
  password: varchar({length: 255}).notNull(),
  residenceState: residencesStatesEnum().notNull().default( MEXICO_STATES.outside ),
  rol: rolsEnum().notNull().default( ROLS.user ),
});
