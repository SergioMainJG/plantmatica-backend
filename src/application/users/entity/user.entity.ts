import { validate } from 'uuid';
import { createUserBirthday, UserBirthday } from "~/core/users/value-objects/user-birthdate.vo";
import { createUserEmail, UserEmail } from "~/core/users/value-objects/user-email.vo";
import { createUserGender, UserGender } from "~/core/users/value-objects/user-gender.vo";
import { createUserName, UserName } from "~/core/users/value-objects/user-name.vo";
import { createUserPassword, UserPassword } from "~/core/users/value-objects/user-password.vo";
import { createUserResidenceState, UserResidenceState } from "~/core/users/value-objects/user-residence-state.vo";
import { createUserRol, UserRol } from "~/core/users/value-objects/user-rol.vo";
import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";
import { User } from "~/core/users/user";

interface UserProps {
  birthdate: string;
  email: string;
  gender: string;
  isVerified: boolean;
  name: string;
  password: string;
  residenceState: string;
  rol: string;
  id?: string;
}

export class UserEntity implements User {
  
  private constructor(
    public birthdate: UserBirthday,
    public email: UserEmail,
    public gender: UserGender,
    public isVerified: boolean,
    public name: UserName,
    public password: UserPassword,
    public residenceState: UserResidenceState,
    public rol: UserRol,
    public id?: string,
  ){}

  static create = async ( datos: UserProps ): Promise<UserEntity> => {
    const birthdateVO:UserBirthday =  createUserBirthday(datos['birthdate']);
    const emailVO:UserEmail = createUserEmail(datos['email']);
    const genderVO:UserGender = createUserGender(datos['gender']);
    const isVerifiedVO:boolean = datos['isVerified'];
    const nameVO:UserName = createUserName(datos['name']);
    const passwordVO:UserPassword = await createUserPassword(datos['password']);
    const residenceStateVO:UserResidenceState = createUserResidenceState(datos['residenceState']);
    const rolVO:UserRol = createUserRol(datos['rol']);
    
    if( datos['id'] )
      if( !validate(datos['id']) )
        throw new TypeNotSatisfiedError(`id must be a valid uuidv7`);

    return new UserEntity(
      birthdateVO,
      emailVO,
      genderVO,
      isVerifiedVO,
      nameVO,
      passwordVO,
      residenceStateVO,
      rolVO,
      datos['id'],
    )
  }
}

