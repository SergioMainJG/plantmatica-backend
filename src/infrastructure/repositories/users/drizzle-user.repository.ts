import { Injectable } from "@nestjs/common";
import { UserRepository } from "~/application/ports/user.repository";
import { UserEntity } from "~/application/users/entity/user.entity";
import { DrizzleService } from "~/infrastructure/drizzle/drizzle.service";
import { UsersTable } from "~/infrastructure/drizzle/schema/user-drizzle.schema";
import {v7 as uuid} from 'uuid';

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
        async({
          birthdate,email, gender, id, isVerified, name, password, residenceState, rol 
        })=>(
          await UserEntity .create({
          birthdate: birthdate,
          email: email,
          gender: gender,
          isVerified: isVerified,
          name: name,
          password: password,
          residenceState: residenceState,
          rol: rol,
          id: id
          })
        )
      )
    );
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

    return await UserEntity.create({
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