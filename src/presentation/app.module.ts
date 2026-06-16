import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from 'src/infrastructure/drizzle/drizzle.module';
import { UsersModule } from '~/presentation/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DrizzleModule,
    UsersModule,
  ],
})
export class AppModule {}
