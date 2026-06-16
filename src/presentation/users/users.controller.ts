import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "../../application/users/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";


@Controller('users')
export class UsersController{
  constructor( private readonly usersService: UsersService ){}

  @Get()
  findAll(){
    return this.usersService.findAll();
  }

  @Post()
  save(
    @Body() createUserDto: CreateUserDto
  ){
    return this.usersService.create( createUserDto );
  }
}