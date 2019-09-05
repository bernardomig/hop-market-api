import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, Controller } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({exceptionFactory: (errors: ValidationError[]) => {
    const {property, constraints} = errors[0];

    const values = Object.values(constraints);

    return new BadRequestException(`Error validating input field ${property}: ${values.join(', ')}`); }}));
  await app.listen(3000);
}
bootstrap();
