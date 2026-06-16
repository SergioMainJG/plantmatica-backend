import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { UserRepository } from "../ports/user.repository";
import { RegisterUserDto } from "~/presentation/users/dtos/register-user.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "~/presentation/users/dtos/login-user.dto";
import { passwordsConfig } from "~/config/hash/argon2.hash";
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UsersService{
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ){}
  
  private getJwtToken( payload: JWTPayload ) {
    const token = this.jwtService.sign( payload );
    return token;

  }

  async findAll(): Promise<UserEntity[]>{
    return await this.userRepository.findAll();
  }
  
  async login(loginUserDto: LoginUserDto): Promise<{user: UserEntity, token: string}>{
    const user = await this.userRepository.findOneByDto(loginUserDto);

    if( !user )
      throw new UnauthorizedException(`Credentials not valid (credentials)`);

    if( !(await passwordsConfig.verify( loginUserDto.password, user.password )) )
      throw new UnauthorizedException(`Credentials not valid (password)`);

    return {
      user: user,
      token: this.getJwtToken({id: user.id!})
    };
  }
  async findOneById(id: string): Promise<UserEntity>{
    return await this.userRepository.findOneById(id);
  }

  async register( registerUserDto : RegisterUserDto): Promise<UserEntity>{
    const newUser = await UserEntity.create({...registerUserDto, isVerified: false, rol: 'Usuario'})
    return await this.userRepository.save(newUser);
  }
}