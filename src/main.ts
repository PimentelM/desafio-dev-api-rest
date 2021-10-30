import {Module} from "@nestjs/common";

require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "./pipes/ValidationPipe";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export async function setupApp(app) : Promise<void> {
  // Adiciona um pipe de validação através da biblioteca class-validator para todas as requisições
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: true}))

  // Configura o Swagger, que será o nosso sistema de documentação de API
  const config = new DocumentBuilder()
      .setTitle('Desafio Rest API')
      .setDescription('Simulação de operações bancárias utilizando NodeJs e MongoDb')
      .setVersion('1.0')
      .addTag('conta')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

}

async function bootstrap() {
  // Cria nova aplicação em NestJs
  const app = await NestFactory.create(AppModule);

  await setupApp(app)

  // Entra em listening mode
  await app.listen(3000);
}


bootstrap();
