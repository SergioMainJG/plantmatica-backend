import { UserEntity } from "../users/entity/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>
  abstract save( user: UserEntity ): Promise<UserEntity>;
}