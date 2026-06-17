import { Body, Controller, Get, Post, Delete, ForbiddenException, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiBadRequestResponse } from "@nestjs/swagger";
import { UsersService } from "../../application/users/users.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { UserResponseDto, AuthResponseDto, DeleteResponseDto, UpdateResponseDto } from "./dtos/user-response.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { DeleteUserDto } from "./dtos/delete-user.dto";
import { Auth } from "~/application/users/decorators/auth.decorator";
import { GetUser } from "~/application/users/decorators/get-user.decorator";
import { UserEntity } from "~/application/users/entity/user.entity";
import { UpdateUserDto } from "./dtos/update-user.dto";


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Find all users', description: 'Retrieve a list of all registered users.' })
  @ApiOkResponse({ type: [UserResponseDto], description: 'List of users retrieved successfully.' })
  async findAll() {
    return (await this.usersService.findAll())
      .map(user => UserResponseDto.fromEntity(user));
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user using email/username credentials.' })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Authentication successful. Returns user info and JWT.' })
  @ApiBadRequestResponse({ description: 'Invalid input or validation error.' })
  @ApiForbiddenResponse({ description: 'Incorrect credentials or unauthorized access.' })
  async findOne(
    @Body() loginUserDto: LoginUserDto
  ) {
    const { user, token } = await this.usersService.login(loginUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { userResponse, token };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user', description: 'Create a new user account.' })
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'Registration successful. Returns user info and JWT.' })
  @ApiBadRequestResponse({ description: 'Invalid input or email already exists.' })
  async save(
    @Body() createUserDto: RegisterUserDto
  ) {
    const { user, token } = await this.usersService.register(createUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { userResponse, token };
  }

  @Delete()
  @Auth()
  @ApiOperation({ summary: 'Delete user', description: 'Delete the user account. Requires credentials verification and user ownership check.' })
  @ApiOkResponse({ type: DeleteResponseDto, description: 'User account deleted successfully.' })
  @ApiForbiddenResponse({ description: 'Forbidden - Cannot delete other users accounts.' })
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
  @ApiOperation({ summary: 'Update user', description: 'Update profile properties of the authenticated user.' })
  @ApiOkResponse({ type: UpdateResponseDto, description: 'User account updated successfully.' })
  @ApiForbiddenResponse({ description: 'Forbidden - Cannot update other users accounts.' })
  @ApiBadRequestResponse({ description: 'Invalid input or validation error.' })
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