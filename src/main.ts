require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "./pipes/ValidationPipe";

async function bootstrap() {
  // Cria nova aplicação em NestJs
  const app = await NestFactory.create(AppModule);

  // Adiciona um pipe de validação através da biblioteca class-validator para todas as requisições
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: true}))

  // Entra em listening mode
  await app.listen(3000);
}


bootstrap();
