import { ValidationPipe } from './pipes/ValidationPipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Função usada para configurar a instância da aplicação como desejado.
// Pode ser utilizada para reproduzir o comportamento da aplicação em testes end2end
export async function setupApp(app): Promise<void> {
  // Adiciona um pipe de validação através da biblioteca class-validator para todas as requisições
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  // Configura o Swagger, que será o nosso sistema de documentação de API
  const config = new DocumentBuilder()
    .setTitle('Desafio Rest API')
    .setDescription(
      'Simulação de operações bancárias utilizando NodeJs e MongoDb',
    )
    .setVersion('1.0')
    .addTag('conta')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
