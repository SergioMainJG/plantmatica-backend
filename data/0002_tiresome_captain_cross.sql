ALTER TABLE "users" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."GENDER";--> statement-breakpoint
CREATE TYPE "public"."GENDER" AS ENUM('Male', 'Female', 'I prefer not comment about it');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DATA TYPE "public"."GENDER" USING "gender"::"public"."GENDER";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "residenceState" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "residenceState" SET DEFAULT 'Residuo fuera del pais'::text;--> statement-breakpoint
DROP TYPE "public"."RESIDENCES_STATES";--> statement-breakpoint
CREATE TYPE "public"."RESIDENCES_STATES" AS ENUM('Residuo fuera del pais', 'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Coahuila de Zaragoza', 'Colima', 'CDMX', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Estado de Mexico', 'Michoacan de Ocampo', 'Morelos', 'Nayarit', 'Nuevo Leon', 'Oaxaca', 'Puebla', 'Queretaro de Arteaga', 'Quintana Roo', 'San Luis Potosi', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz de Ignacio de la Llave', 'Yucatan', 'Zacatecas');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "residenceState" SET DEFAULT 'Residuo fuera del pais'::"public"."RESIDENCES_STATES";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "residenceState" SET DATA TYPE "public"."RESIDENCES_STATES" USING "residenceState"::"public"."RESIDENCES_STATES";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "rol" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "rol" SET DEFAULT 'Usuario'::text;--> statement-breakpoint
DROP TYPE "public"."ROLS";--> statement-breakpoint
CREATE TYPE "public"."ROLS" AS ENUM('Administrador', 'Usuario');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "rol" SET DEFAULT 'Usuario'::"public"."ROLS";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "rol" SET DATA TYPE "public"."ROLS" USING "rol"::"public"."ROLS";