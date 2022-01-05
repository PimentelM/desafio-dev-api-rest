import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { BankingModule } from './modules/banking';
import { DatabaseModule } from './modules/database';

@Module({
  imports: [
    BankingModule,
    DatabaseModule,

    // Aqui especificamos que cada controller terá seu caminho prefixado por /api e podemos especificar um prefixo para cada módulo da API.
    RouterModule.register([
      {
        path: '/api',
        children: [{ path: '/banking', module: BankingModule }],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
