import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DomainErrorFilter } from './filters/domain-error.filter';
import { DrizzleQueryFilter } from './filters/drizzle-error.filter';

(async () => {

  if (!process.versions.bun) {
    throw new Error('Bun is required');
  }

  const app = await NestFactory
    .create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      { logger: ['error', 'log', 'debug', 'warn'] }
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

  app.enableCors({
    origin: [`http://plantmatica.sergioar.dev`, `http://localhost:3000`],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });
  await app.register(fastifyCsrf);

  await app.register(helmet);
  await app.listen(3000, '0.0.0.0');
})();