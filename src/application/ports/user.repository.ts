import { LoginUserDto } from "~/presentation/users/dtos/login-user.dto";
import { DeleteUserDto } from "~/presentation/users/dtos/delete-user.dto";
import { UserEntity } from "../users/entity/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>
  abstract findOneByDto(loginUserDto: Partial<LoginUserDto>): Promise<UserEntity>;
  abstract findOneById(id: string): Promise<UserEntity>;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract delete(deleteUserDto: DeleteUserDto): Promise<boolean>;
  abstract update(credential: string, userEntity: UserEntity): Promise<UserEntity>;
}