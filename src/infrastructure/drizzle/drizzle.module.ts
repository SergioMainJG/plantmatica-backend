import { Global, Module } from "@nestjs/common";
import { DrizzleService } from "./drizzle.service";
import { DrizzleUserRepository } from "../repositories/users/drizzle-user.repository";

@Global()
@Module({
  providers: [DrizzleService, DrizzleUserRepository],
  exports: [DrizzleService, DrizzleUserRepository]
})
export class DrizzleModule {

}