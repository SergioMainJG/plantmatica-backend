import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "./entity/user.entity";
import { RegisterUserDto } from "~/presentation/users/dtos/register-user.dto";
import { LoginUserDto } from "~/presentation/users/dtos/login-user.dto";
import { DeleteUserDto } from "~/presentation/users/dtos/delete-user.dto";
import { passwordsConfig } from "~/config/hash/argon2.hash";
import { UserRepository } from "../ports/user.repository";
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { UpdateUserDto } from "~/presentation/users/dtos/update-user.dto";

interface UserLogged {
  user: UserEntity;
  token: string;
}

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  private getJwtToken(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;

  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }

  async login(loginUserDto: LoginUserDto): Promise<UserLogged> {
    const user = await this.userRepository.findOneByDto(loginUserDto);

    if (!user)
      throw new UnauthorizedException(`Credentials not valid (credentials)`);

    if (!(await passwordsConfig.verify(loginUserDto.password, user.password)))
      throw new UnauthorizedException(`Credentials not valid (password)`);

    return {
      user: user,
      token: this.getJwtToken({ id: user.id! })
    };
  }
  async findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserLogged> {
    const newUserEntity = await UserEntity.create({
      ...registerUserDto,
      ...registerUserDto.permissions,
      isVerified: false,
      rol: 'Usuario',
    });
    const user = await this.userRepository.save(newUserEntity);
    return {
      user: user,
      token: this.getJwtToken({ id: user.id! })
    };
  }

  async delete(deleteUserDto: DeleteUserDto): Promise<boolean> {
    return await this.userRepository.delete(deleteUserDto);
  }

  async update({ credential, password, ...toUpdate }: UpdateUserDto): Promise<UserEntity> {
    const userFromDb = await this.userRepository.findOneByDto({ credential: credential, password: password });

    if (!userFromDb)
      throw new UnauthorizedException(`Credentials not valid (credentials)`);

    if (!(await passwordsConfig.verify(password, userFromDb.password)))
      throw new UnauthorizedException(`Credentials not valid (password)`);

    const { password: _password, ...restUserFromDB } = userFromDb;

    const newPassword = toUpdate.newPassword || password;

    const newUserEntity = await UserEntity.create({
      ...restUserFromDB,
      ...restUserFromDB.permissions,
      ...toUpdate,
      password: newPassword,
    });
    return await this.userRepository.update(credential, newUserEntity);
  }

  async isAccountOwner(id: string, credential: string): Promise<boolean> {
    const targetUser = await this.userRepository.findOneByDto({ credential });

    return id === targetUser.id;
  }
}