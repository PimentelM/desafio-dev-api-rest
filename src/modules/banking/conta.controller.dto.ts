import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { ObjectId, Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// Aqui nós definimos as classes do tipo "Data To Object"
// Elas são usadas para converter os dados vindo do usuário em objetos tipados
// O DTO pode ser utilizado para inserir validações e metadados adicionais
export class CriarContaDto {
  @IsNotEmpty()
  @IsObjectId()
  @ApiProperty({ example: '112233445566112233445566' })
  pessoa: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  limiteSaqueDiario: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  flagAtivo: boolean;

  @IsNotEmpty()
  @IsNumber()
  tipoConta: number;
}

export class BloquearContaDto {
  @IsNotEmpty()
  @IsObjectId()
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  conta: string;
}

export class DepositarValorDto {
  @IsNotEmpty()
  @IsObjectId()
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  conta: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  valor: number;
}

export class SacarValorDto {
  @IsNotEmpty()
  @IsObjectId()
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  conta: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  valor: number;
}

// Alguns tipos de retorno que utilizaremos em funções para que o Swagger obtenha mais informações sobre a API de forma automática.
export class Conta {
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  _id: string;
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  pessoa: string;
  saldo: number;
  limiteSaqueDiario: number;
  flagAtivo: boolean;
  tipoConta: number;
  dataCriacao: Date;
}

export class Saldo {
  saldo: number;
}

export class TransacaoExtrato {
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  conta: string;
  valor: number;
  dataTransacao: Date;
}

export class TransacaoResultado {
  transacao: string;
  novoSaldo: number;
}

export class Message {
  message: string;
}
