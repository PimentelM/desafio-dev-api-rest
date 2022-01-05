import { Module } from '@nestjs/common';
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';

async function bootstrap() {
  // Cria nova aplicação em NestJs
  const app = await NestFactory.create(AppModule);

  await setupApp(app);

  // Entra em listening mode
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
