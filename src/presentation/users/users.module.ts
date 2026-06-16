import { Module } from "@nestjs/common";
import { UsersService } from "~/application/users/users.service";
import { UsersController } from "./users.controller";
import { DrizzleUserRepository } from "~/infrastructure/repositories/users/drizzle-user.repository";
import { UserRepository } from "~/application/ports/user.repository";
import { JwtAuthGuard } from "~/application/users/guard/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { envs } from "~/config/envs/envs.config";

@Module({
  providers: [
    JwtAuthGuard,
    UsersService,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository
    },
  ],
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: envs.JWT_SECRET,
        signOptions: { expiresIn: '2h' }
      })
    })
  ],
  controllers: [UsersController],
  exports: [JwtAuthGuard, JwtModule]
})
export class UsersModule {}