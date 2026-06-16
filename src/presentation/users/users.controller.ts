import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "../../application/users/users.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { LoginUserDto } from "./dtos/login-user.dto";


@Controller('users')
export class UsersController{
  constructor( private readonly usersService: UsersService ){}

  @Get()
  async findAll(){
    return (await this.usersService.findAll())
      .map( user => UserResponseDto.fromEntity(user));
  }

  @Post('login')
  async findOne(
    @Body() loginUserDto: LoginUserDto
  ){
    const {user, token} = await this.usersService.login(loginUserDto);
    const userResponse = UserResponseDto.fromEntity(user);
    return { userResponse, token };
  }

  @Post('register')
  save(
    @Body() createUserDto: RegisterUserDto
  ){
    return this.usersService.register( createUserDto );
  }

  //!TODO: Confirmar cuenta con correo (en n8n?)
  //!TODO: Borrar
  //!TODO: Actualizar: email, gender, name, password, residenceState, rol (Si lo hace un admin) 
  //!TODO:

}