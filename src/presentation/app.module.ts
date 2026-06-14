import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '~/application/drizzle/drizzle.module';
import { UsersModule } from '~/application/user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DrizzleModule,
    UsersModule,
  ],
})
export class AppModule {}