import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ParseObjectIdPipe } from '../../pipes/ParseObjectIdPipe';
import { ParseDateTimePipe } from '../../pipes/ParseDateTimePipe';
import { ContaService } from './conta.service';
import {
  BloquearContaDto,
  CriarContaDto,
  DepositarValorDto,
  SacarValorDto,
  Conta,
  Message,
  Saldo,
  TransacaoExtrato,
  TransacaoResultado,
} from './conta.controller.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('conta')
@Controller('conta')
export class ContaController {
  constructor(private contaService: ContaService) {}

  @ApiParam({
    name: 'contaId',
    example: '507f191e810c19729de860ea',
    description: 'Id da conta',
  })
  @Get(`/saldo/:contaId`)
  saldoConta(
    @Param(`contaId`, ParseObjectIdPipe) conta: string,
  ): Promise<Saldo> {
    return this.contaService.consultarSaldo(conta);
  }

  @ApiParam({
    name: 'contaId',
    example: '507f191e810c19729de860ea',
    description: 'Id da conta',
  })
  @ApiParam({
    name: 'inicioPeriodo',
    example: '2010-01-01T21:49:34.962Z',
  })
  @ApiParam({
    name: 'fimPeriodo',
    example: '2025-10-30T21:49:34.962Z',
  })
  @Get(`/extrato/:contaId`)
  extratoConta(
    @Param(`contaId`, ParseObjectIdPipe) conta: string,
    @Query(`inicioPeriodo`, ParseDateTimePipe) inicioPeriodo?: Date,
    @Query('fimPeriodo', ParseDateTimePipe) fimPeriodo?: Date,
  ): Promise<TransacaoExtrato[]> {
    return this.contaService.obterExtrato(conta, {
      inicio: inicioPeriodo,
      fim: fimPeriodo,
    });
  }

  @Post(`/criar`)
  criarConta(
    @Body() { pessoa, limiteSaqueDiario, flagAtivo, tipoConta }: CriarContaDto,
  ): Promise<Conta> {
    return this.contaService.criarConta(
      pessoa,
      limiteSaqueDiario,
      flagAtivo,
      tipoConta,
    );
  }

  @Post(`/depositar-valor`)
  depositarValor(
    @Body() { conta, valor }: DepositarValorDto,
  ): Promise<TransacaoResultado> {
    return this.contaService.depositarValor(conta, valor);
  }

  @Post(`/sacar-valor`)
  sacarValor(
    @Body() { conta, valor }: SacarValorDto,
  ): Promise<TransacaoResultado> {
    return this.contaService.sacarValor(conta, valor);
  }

  @Post(`/bloquear`)
  async bloquearConta(@Body() { conta }: BloquearContaDto): Promise<Message> {
    await this.contaService.bloquearConta(conta);
    return {
      message: 'Conta bloqueada com sucesso.',
    };
  }
}
