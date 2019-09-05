import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ValidationError } from 'class-validator';

const globalPipe = new ValidationPipe({
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const { property, constraints } = errors[0];

    const values = Object.values(constraints);

    return new BadRequestException(
      `Error validating input field ${property}: ${values.join(', ')}`,
    );
  },
});

const swaggerDocument = new DocumentBuilder()
  .setTitle('HopMarket')
  .setDescription('A relational market for everyone')
  .setVersion('0.1')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(globalPipe);

  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(app, swaggerDocument),
  );

  await app.listen(3000);
}
bootstrap();
