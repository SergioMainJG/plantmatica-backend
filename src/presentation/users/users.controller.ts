import { Body, Controller, Get, Post, Delete, ForbiddenException, Patch } from "@nestjs/common";
import { UsersService } from "../../application/users/users.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { DeleteUserDto } from "./dtos/delete-user.dto";
import { Auth } from "~/application/users/decorators/auth.decorator";
import { GetUser } from "~/application/users/decorators/get-user.decorator";
import { UserEntity } from "~/application/users/entity/user.entity";
import { UpdateUserDto } from "./dtos/update-user.dto";


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    return (await this.usersService.findAll())
      .map(user => UserResponseDto.fromEntity(user));
  }

  @Post('login')
  async findOne(
    @Body() loginUserDto: LoginUserDto
  ) {
    const { user, token } = await this.usersService.login(loginUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { userResponse, token };
  }

  @Post('register')
  async save(
    @Body() createUserDto: RegisterUserDto
  ) {
    const { user, token } = await this.usersService.register(createUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { userResponse, token };
  }

  @Delete()
  @Auth()
  async delete(
    @Body() deleteUserDto: DeleteUserDto,
    @GetUser() currentUser: UserEntity
  ) {

    const isOwner = await this.usersService.isAccountOwner(
      currentUser.id!,
      deleteUserDto.credential
    );

    if (!isOwner)
      throw new ForbiddenException(`You can only delete your own account`);

    const isDeleted = await this.usersService.delete(deleteUserDto);
    return { isDeleted };
  }
  @Patch()
  @Auth()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: UserEntity,
  ) {
    const isOwner = await this.usersService.isAccountOwner(currentUser.id!, updateUserDto.credential);
    if (!isOwner)
      throw new ForbiddenException(`You can only delete your own account`);

    const userEntity = await this.usersService.update(updateUserDto);
    const { getEmail, getId, getName } = UserResponseDto.fromEntity(userEntity);

    return {
      id: getId,
      email: getEmail,
      name: getName,
      gender: userEntity.gender,
      residenceState: userEntity.residenceState,
      birthdate: userEntity.birthdate,
      hasPasswordChanged: !!updateUserDto.newPassword,
    }
  }

  //!TODO: Confirmar cuenta con correo (en n8n?)

}