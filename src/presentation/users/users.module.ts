import { Module } from "@nestjs/common";
import { UsersService } from "~/application/users/users.service";
import { UsersController } from "./users.controller";
import { DrizzleUserRepository } from "~/infrastructure/repositories/users/drizzle-user.repository";
import { UserRepository } from "~/application/ports/user.repository";

@Module({
  providers: [UsersService,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository
    }
  ],
  controllers: [UsersController]
})
export class UsersModule{}