import { Module } from "@nestjs/common";
import { UsersService } from "~/application/users/users.service";
import { UsersController } from "./users.controller";
import { DrizzleUserRepository } from "~/infrastructure/repositories/users/drizzle-user.repository";
import { UserRepository } from "~/application/ports/user.repository";
import { JWTStrategy } from "~/application/users/strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { envs } from "~/config/envs/envs.config";

@Module({
  providers: [
    JWTStrategy,
    UsersService,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository
    },
  ],
  imports:[
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: envs.JWT_SECRET,
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  controllers: [UsersController],
  exports: [JWTStrategy, PassportModule, JwtModule]
})
export class UsersModule{}