import { Injectable } from "@nestjs/common";
import { DrizzleService } from "../drizzle/drizzle.service";
import { UsersTable } from "./schema/user-drizzle.schema";


@Injectable()
export class UsersService{
  constructor(private drizzleService: DrizzleService ){}

  async findAll(){
    return await this.drizzleService
      .getDb()
      .select()
      .from(UsersTable);
  }
}