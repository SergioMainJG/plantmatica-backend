import { validate } from 'uuid';
import { createUserBirthday, UserBirthday } from "~/core/users/value-objects/user-birthdate.vo";
import { createUserEmail, UserEmail } from "~/core/users/value-objects/user-email.vo";
import { createUserGender, UserGender } from "~/core/users/value-objects/user-gender.vo";
import { createUserName, UserName } from "~/core/users/value-objects/user-name.vo";
import { createUserPassword, UserPassword } from "~/core/users/value-objects/user-password.vo";
import { createUserResidenceState, UserResidenceState } from "~/core/users/value-objects/user-residence-state.vo";
import { createUserRol, UserRol } from "~/core/users/value-objects/user-rol.vo";
import { TrackingPermissions } from "~/core/users/value-objects/user-tracking-permissions.vo"
import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";
import { User } from "~/core/users/user";

export interface UserProps {
  birthdate: unknown;
  email: unknown;
  gender: unknown;
  isVerified: boolean;
  name: unknown;
  password: unknown;
  residenceState: unknown;
  rol: unknown;
  id?: string;
  isAgeAllowed: boolean;
  isStateAllowed: boolean;
  isGenderAllowed: boolean;
  isMarketingAllowed: boolean;
  isAdsAllowed: boolean;
}

export class UserEntity implements User {

  private constructor(
    public birthdate: UserBirthday,
    public email: UserEmail,
    public gender: UserGender,
    public isVerified: boolean,
    public name: UserName,
    public password: UserPassword,
    public permissions: TrackingPermissions,
    public residenceState: UserResidenceState,
    public rol: UserRol,
    public id?: string,
  ) { }

  public static readonly create = async (props: UserProps): Promise<UserEntity> => {
    const birthdateVO: UserBirthday = createUserBirthday(props['birthdate']);
    const emailVO: UserEmail = createUserEmail(props['email']);
    const genderVO: UserGender = createUserGender(props['gender']);
    const isVerifiedVO: boolean = props['isVerified'];
    const nameVO: UserName = createUserName(props['name']);
    const passwordVO: UserPassword = await createUserPassword(props['password']);
    const residenceStateVO: UserResidenceState = createUserResidenceState(props['residenceState']);
    const rolVO: UserRol = createUserRol(props['rol']);

    if (props['id'])
      if (!validate(props['id']))
        throw new TypeNotSatisfiedError(`id must be a valid uuidv7`);

    return new UserEntity(
      birthdateVO,
      emailVO,
      genderVO,
      isVerifiedVO,
      nameVO,
      passwordVO,
      {
        isAgeAllowed: props['isAgeAllowed'],
        isStateAllowed: props['isStateAllowed'],
        isGenderAllowed: props['isGenderAllowed'],
        isMarketingAllowed: props['isMarketingAllowed'],
        isAdsAllowed: props['isAdsAllowed'],
      },
      residenceStateVO,
      rolVO,
      props['id'],
    )
  }

  public static readonly fromModel = (props: UserProps): UserEntity => {
    return new UserEntity(
      props.birthdate as unknown as UserBirthday,
      props.email as unknown as UserEmail,
      props.gender as unknown as UserGender,
      props.isVerified,
      props.name as unknown as UserName,
      props.password as unknown as UserPassword,
      {
        isAgeAllowed: props.isAgeAllowed,
        isStateAllowed: props.isStateAllowed,
        isGenderAllowed: props.isGenderAllowed,
        isMarketingAllowed: props.isMarketingAllowed,
        isAdsAllowed: props.isAdsAllowed,
      },
      props.residenceState as unknown as UserResidenceState,
      props.rol as unknown as UserRol,
      props.id,
    )
  }
}

