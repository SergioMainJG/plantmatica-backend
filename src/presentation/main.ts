import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

( async () => {

  if( !process.versions.bun ){
    throw 'Bun is required'
  }

  const app = await NestFactory
    .create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
          logger: true
          }
        )
    );
    
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  
  await app.listen(3000, '0.0.0.0');
})();