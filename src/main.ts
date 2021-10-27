import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "./pipes/ValidationPipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adiciona um pipe de validação através da biblioteca class-validator para todas as requisições
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: true}))

  await app.listen(3000);
}
bootstrap();
