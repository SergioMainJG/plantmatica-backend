import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { v7 as uuid, validate } from 'uuid';
import { eq, SQL } from 'drizzle-orm';
import { UserRepository } from "~/application/ports/user.repository";
import { UserEntity } from "~/application/users/entity/user.entity";
import { DrizzleService } from "~/infrastructure/drizzle/drizzle.service";
import { UsersTable } from "~/infrastructure/drizzle/schema/user-drizzle.schema";
import { LoginUserDto } from "~/presentation/users/dtos/login-user.dto";
import { DeleteUserDto } from "~/presentation/users/dtos/delete-user.dto";

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly drizzleService: DrizzleService) { }

  async findAll(): Promise<UserEntity[]> {
    const usersFromDB = await this.drizzleService
      .getDb()
      .select()
      .from(UsersTable);

    return await Promise.all(
      usersFromDB.map(
        async (user) => (UserEntity.fromModel(user))
      )
    );
  }

  async findOneByDto(loginUserDto: Partial<LoginUserDto>): Promise<UserEntity> {

    if (!loginUserDto.credential)
      throw new BadRequestException(`credential is required`);

    const field = loginUserDto.credential?.includes('@') ? UsersTable.email : UsersTable.name;

    const [userFromDb] = await this.drizzleService
      .getDb()
      .select()
      .from(UsersTable)
      .where(eq(field, loginUserDto['credential']))

    if (!userFromDb)
      throw new NotFoundException(`User not found`);
    return UserEntity.fromModel({ ...userFromDb });
  }

  async findOneById(id: string): Promise<UserEntity> {
    const [userFromDb] = await this.drizzleService
      .getDb()
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, id))

    return UserEntity.fromModel({ ...userFromDb! });
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    const birthdateAsString = userEntity.birthdate.toString();
    const [newUser] = await this.drizzleService
      .getDb()
      .insert(UsersTable)
      .values({
        id: uuid(),
        birthdate: birthdateAsString,
        email: userEntity.email,
        gender: userEntity.gender,
        isVerified: userEntity.isVerified,
        name: userEntity.name,
        password: userEntity.password,
        residenceState: userEntity.residenceState,
        rol: userEntity.rol,
        isAgeAllowed: userEntity.permissions.isAgeAllowed,
        isStateAllowed: userEntity.permissions.isStateAllowed,
        isGenderAllowed: userEntity.permissions.isGenderAllowed,
        isMarketingAllowed: userEntity.permissions.isMarketingAllowed,
        isAdsAllowed: userEntity.permissions.isAdsAllowed,
      })
      .returning();
    return UserEntity.fromModel({ ...newUser! });
  }

  async delete(deleteUserDto: DeleteUserDto): Promise<boolean> {
    let condition: SQL<unknown>;
    if (deleteUserDto.credential.includes('@'))
      condition = eq(UsersTable.email, deleteUserDto.credential)
    else if (validate(deleteUserDto.credential))
      condition = eq(UsersTable.id, deleteUserDto.credential)
    else condition = eq(UsersTable.name, deleteUserDto.credential);

    const { rowCount } = await this.drizzleService.getDb()
      .delete(UsersTable)
      .where(condition);

    return rowCount === 1;
  }

  async update(credential: string, userEntity: UserEntity): Promise<UserEntity> {
    let condition: SQL<unknown>;
    if (credential.includes('@'))
      condition = eq(UsersTable.email, credential)
    else if (validate(credential))
      condition = eq(UsersTable.id, credential)
    else condition = eq(UsersTable.name, credential);

    const [updatedUser] = await this.drizzleService.getDb()
      .update(UsersTable)
      .set({
        birthdate: userEntity.birthdate.toString(),
        email: userEntity.email,
        gender: userEntity.gender,
        isVerified: userEntity.isVerified,
        name: userEntity.name,
        password: userEntity.password,
        residenceState: userEntity.residenceState,
        rol: userEntity.rol,
        isAgeAllowed: userEntity.permissions.isAgeAllowed,
        isStateAllowed: userEntity.permissions.isStateAllowed,
        isGenderAllowed: userEntity.permissions.isGenderAllowed,
        isMarketingAllowed: userEntity.permissions.isMarketingAllowed,
        isAdsAllowed: userEntity.permissions.isAdsAllowed,
      })
      .where(condition)
      .returning();

    if (!updatedUser)
      throw new NotFoundException(`user not found`);

    return UserEntity.fromModel(updatedUser);
  }
}