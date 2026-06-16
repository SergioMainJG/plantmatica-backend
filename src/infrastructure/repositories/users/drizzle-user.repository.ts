import { Injectable } from "@nestjs/common";
import {v7 as uuid} from 'uuid';
import { eq } from 'drizzle-orm';
import { UserRepository } from "~/application/ports/user.repository";
import { UserEntity } from "~/application/users/entity/user.entity";
import { DrizzleService } from "~/infrastructure/drizzle/drizzle.service";
import { UsersTable } from "~/infrastructure/drizzle/schema/user-drizzle.schema";
import { LoginUserDto } from "~/presentation/users/dtos/login-user.dto";

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private drizzleService: DrizzleService ){}
  
  async findAll(): Promise<UserEntity[]> {
    const usersFromDB = await this.drizzleService
      .getDb()
      .select()
      .from(UsersTable);

    return await Promise.all(
      usersFromDB.map(
        async(user)=>(UserEntity.fromModel(user))
      )
    );
  }

  async findOneByDto(loginUserDto: LoginUserDto): Promise<UserEntity> {

    const field = loginUserDto.credential.includes('@') ? UsersTable.email : UsersTable.name;

    const [userFromDb] = await this.drizzleService
        .getDb()
        .select()
        .from(UsersTable)
        .where(eq(field, loginUserDto['credential']))
    
    return UserEntity.fromModel({...userFromDb!});  
  }
  
  async findOneById(id: string): Promise<UserEntity> {
    const [userFromDb] = await this.drizzleService
        .getDb()
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, id))
    
    return UserEntity.fromModel({...userFromDb!});  
  }
  
  async save({
    birthdate,
    email,
    gender,
    isVerified,
    name,
    password,
    residenceState,
    rol
  }: UserEntity): Promise<UserEntity> {
    const birthdateAsString = birthdate.toString();
    const [newUser] = await this.drizzleService
      .getDb()
      .insert(UsersTable)
      .values({
        id: uuid(),
        email: email,
        gender: gender,
        isVerified: isVerified,
        name: name,
        password: password,
        residenceState: residenceState,
        rol: rol,
        birthdate: birthdateAsString
      }).returning();

    return await UserEntity.fromModel({
      birthdate: newUser!.birthdate,
      email: newUser!.email,
      gender: newUser!.gender,
      isVerified: newUser!.isVerified,
      name: newUser!.name,
      password: newUser!.password,
      residenceState: newUser!.residenceState,
      rol: newUser!.rol,
      id: newUser!.id,
    });
  }

}