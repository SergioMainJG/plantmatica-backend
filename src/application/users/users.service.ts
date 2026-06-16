import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { UserRepository } from "../ports/user.repository";
import { CreateUserDto } from "~/presentation/users/dtos/create-user.dto";


@Injectable()
export class UsersService{
  
  constructor(
    private readonly userRepository: UserRepository
  ){}
  
  async findAll(): Promise<UserEntity[]>{
    return await this.userRepository.findAll();
  }

  async create({
    birthdate,
    email,
    gender,
    isVerified,
    name,
    password,
    residenceState,
    rol
  }: CreateUserDto): Promise<UserEntity>{
    const newUser = await UserEntity.create({
        birthdate:birthdate,
        email:email,
        gender:gender,
        isVerified:isVerified,
        name:name,
        password:password,
        residenceState:residenceState,
        rol:rol
    })
    return await this.userRepository.save(newUser);
  }
}