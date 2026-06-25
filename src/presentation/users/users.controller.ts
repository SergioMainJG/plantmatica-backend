import { Body, Controller, Get, Post, Delete, ForbiddenException, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiBadRequestResponse, ApiConflictResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
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
  @ApiOperation({
    summary: 'Find all registered users',
    description: 'Retrieve a complete list of all registered users in the database. This endpoint is typically utilized by administrative services.'
  })
  @ApiOkResponse({
    type: [UserResponseDto],
    description: 'The list of registered users has been successfully retrieved.'
  })
  async findAll() {
    return (await this.usersService.findAll())
      .map(user => UserResponseDto.fromEntity(user));
  }

  @Post('login')
  @ApiOperation({
    summary: 'User Login / Authentication',
    description: 'Authenticate a user using their email address or username and password. Returns user data along with a signed JWT token.'
  })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Successful authentication. Session JWT token and basic profile details returned.'
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - The request body is missing required credential fields.'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid credentials (username/email not found or password mismatch).'
  })
  async findOne(
    @Body() loginUserDto: LoginUserDto
  ) {
    const { user, token } = await this.usersService.login(loginUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { user:userResponse, token };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user account',
    description: 'Create a new user account with birthdate, name, residence state, email, gender, password, and privacy tracking permissions.'
  })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'User successfully registered and authenticated. Basic profile info and session JWT token returned.'
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Validation failed (e.g. invalid email format, birthdate format, short name, weak password, or residence state not matching standard list).'
  })
  @ApiConflictResponse({
    description: 'Conflict - The specified email address or username is already taken.'
  })
  async save(
    @Body() createUserDto: RegisterUserDto
  ) {
    const { user, token } = await this.usersService.register(createUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { user: userResponse, token };
  }

  @Delete()
  @Auth()
  @ApiOperation({
    summary: 'Delete user account',
    description: 'Permit users to delete their own account. Requires verification of the current password and credentials.'
  })
  @ApiOkResponse({
    type: DeleteResponseDto,
    description: 'The user account has been successfully deleted.'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Action is unauthorized because you are attempting to delete someone else\'s account.'
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid credentials payload or format.'
  })
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
  @ApiOperation({
    summary: 'Update user profile info',
    description: 'Update the authenticated user\'s profile properties (such as birthdate, email, name, residenceState, gender, and password). All parameters are optional.'
  })
  @ApiOkResponse({
    type: UpdateResponseDto,
    description: 'The user profile has been successfully updated.'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Action is unauthorized because you are attempting to modify an account you do not own.'
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Validation rules failed (e.g. invalid date range, malformed email, or invalid values for gender or residence state).'
  })
  @ApiConflictResponse({
    description: 'Conflict - Email address or username update collides with an existing account.'
  })
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