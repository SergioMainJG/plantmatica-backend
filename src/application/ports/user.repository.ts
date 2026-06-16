import { LoginUserDto } from "~/presentation/users/dtos/login-user.dto";
import { UserEntity } from "../users/entity/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>
  abstract findOneByDto( loginUserDto: LoginUserDto ): Promise<UserEntity>;
  abstract findOneById( id: string ): Promise<UserEntity>;
  abstract save( user: UserEntity ): Promise<UserEntity>;
}