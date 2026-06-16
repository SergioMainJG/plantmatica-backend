import { UserBirthday } from "./value-objects/user-birthdate.vo";
import { UserEmail } from "./value-objects/user-email.vo";
import { UserGender } from "./value-objects/user-gender.vo";
import { UserName } from "./value-objects/user-name.vo";
import { UserPassword } from "./value-objects/user-password.vo";
import { UserResidenceState } from "./value-objects/user-residence-state.vo";
import { UserRol } from "./value-objects/user-rol.vo";

export interface User {
  readonly birthdate: UserBirthday;
  readonly email: UserEmail;
  readonly gender: UserGender;
  readonly isVerified: boolean;
  readonly name: UserName;
  readonly password: UserPassword;
  readonly residenceState: UserResidenceState;
  readonly rol: UserRol;
}
