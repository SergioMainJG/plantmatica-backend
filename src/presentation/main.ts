import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DomainErrorFilter } from './filters/domain-error.filter';
import { DrizzleQueryFilter } from './filters/drizzle-error.filter';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Plantmatica API')
    .setDescription(`Plantmatica REST API`)
    .setVersion('0.1.6')
    .addTag('Plantmatica')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      _controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const documentFactory = () => SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(
    new DomainErrorFilter(),
    new DrizzleQueryFilter()
  );

  app.enableCors({
    origin: [`http://plantmatica.sergioar.dev`, `http://localhost:3000`, `http://localhost:4200`],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token'],
    credentials: true,
  });
  await app.register(fastifyCsrf);

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https:`, `'unsafe-inline'`],
      },
    },
  });
  await app.listen(3000, '0.0.0.0');
})();