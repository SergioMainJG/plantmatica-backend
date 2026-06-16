import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DomainErrorFilter } from './filters/domain-error.filter';
import { DrizzleQueryFilter } from './filters/drizzle-error.filter';

( async () => {

  if( !process.versions.bun ){
    throw 'Bun is required'
  }

  const app = await NestFactory
    .create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { logger: ['error', 'log', 'debug', 'warn']}
    );
    
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(
    new DomainErrorFilter(),
    new DrizzleQueryFilter()
  );
  
  await app.listen(3000, '0.0.0.0');
})();