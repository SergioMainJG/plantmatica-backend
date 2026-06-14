import { UserEntity } from "~/core/user/user.entity";
import { createUserAge, UserAge } from "~/core/user/value-objects/user-age.vo";
import { createUserEmail, UserEmail } from "~/core/user/value-objects/user-email.vo";
import { createUserGender, UserGender } from "~/core/user/value-objects/user-gender.vo";
import { createUserName, UserName } from "~/core/user/value-objects/user-name.vo";
import { createUserPassword, UserPassword } from "~/core/user/value-objects/user-password.vo";
import { createUserResidenceState, UserResidenceState } from "~/core/user/value-objects/user-residence-state.vo";
import { createUserRol, UserRol } from "~/core/user/value-objects/user-rol.vo";


export class User implements UserEntity{
  constructor(
    public age: UserAge,
    public email: UserEmail,
    public gender: UserGender,
    public isVerified: boolean,
    public name: UserName,
    public password: UserPassword,
    public residenceState: UserResidenceState,
    public rol: UserRol,
  ){
    this.isVerified = isVerified;
    this.age = createUserAge(age);
    this.email = createUserEmail(email);
    this.gender = createUserGender(gender);
    this.name = createUserName(name);
    this.password = createUserPassword(password);
    this.residenceState = createUserResidenceState(residenceState);
    this.rol = createUserRol(rol);
  }
}

