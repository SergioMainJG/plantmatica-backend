CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(50) NOT NULL,
	"gender" "GENDER" NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"name" varchar(20) NOT NULL,
	"password" varchar(255) NOT NULL,
	"residenceState" "RESIDENCES_STATES" DEFAULT 'Residuo fuera del pais' NOT NULL,
	"rol" "ROLS" DEFAULT 'Usuario' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
