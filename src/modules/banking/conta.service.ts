import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ContaRepository } from './conta.repository';

@Injectable()
export class ContaService {
  constructor(private contaRepository: ContaRepository) {}

  async criarConta(
    pessoa: string,
    limiteSaqueDiario: number,
    flagAtivo: boolean,
    tipoConta: number,
  ) {
    // Inicialmente será possível criar apenas uma conta por pessoa
    if (await this.contaRepository.getContaByPessoa(pessoa))
      throw new BadRequestException(`A pessoa já possui uma conta.`);

    return await this.contaRepository.criarConta({
      pessoa,
      saldo: 0,
      limiteSaqueDiario,
      flagAtivo,
      tipoConta,
      dataCriacao: Date.now(),
    });
  }

  async depositarValor(contaId, valor) {
    if (valor <= 0)
      throw new BadRequestException('O valor do depósito deve ser positivo');

    // Faz verificações sobre a conta
    let conta = await this.contaRepository.getContaById(contaId);
    if (!conta) throw new BadRequestException('Conta inexistente');
    if (!conta.flagAtivo) throw new BadRequestException('Conta Inativa');

    return this.contaRepository.realizarTransacao(contaId, valor);
  }

  async sacarValor(contaId, valor) {
    if (valor <= 0)
      throw new BadRequestException('O valor do saque deve ser positivo');

    // Faz verificações sobre a conta
    let conta = await this.contaRepository.getContaById(contaId);
    if (!conta) throw new BadRequestException('Conta inexistente');
    if (!conta.flagAtivo) throw new BadRequestException('Conta Inativa');

    // Faz verificações à cerca do saldo
    if (conta.saldo < valor)
      throw new BadRequestException('Saldo insuficiente');

    // Obtém lista dos saques feitos nas ultimas 24 horas.
    let saquesDoDia = await this.contaRepository.getSaquesDoDia(contaId);

    // Faz a somatória dos valores e obtém o valor absoluto
    let somatoriaSaquesDoDia = Math.abs(
      saquesDoDia.reduce((a, x) => a + x.valor, 0),
    );

    // Faz verificações sobre o limite de saque diário
    if (somatoriaSaquesDoDia + valor > conta.limiteSaqueDiario)
      throw new BadRequestException(
        'Sacar este valor excederá o limite de saque diário',
      );

    // Multiplica o valor da transação por -1 por se tratar de um saque
    return this.contaRepository.realizarTransacao(contaId, valor * -1);
  }

  async bloquearConta(contaId: string) {
    // Faz verificações sobre a conta
    let conta = await this.contaRepository.getContaById(contaId);
    if (!conta) throw new BadRequestException('Conta inexistente');

    // Bloqueia a conta
    await this.contaRepository.bloquearConta(contaId);
  }

  async consultarSaldo(contaId: string) {
    // Faz verificações sobre a conta
    let conta = await this.contaRepository.getContaById(contaId);
    if (!conta) throw new BadRequestException('Conta inexistente');

    return { saldo: conta.saldo };
  }

  async obterExtrato(contaId: string, periodo: { inicio: Date; fim: Date }) {
    // Faz verificações sobre a conta
    let conta = await this.contaRepository.getContaById(contaId);
    if (!conta) throw new BadRequestException('Conta inexistente');

    return this.contaRepository.getExtrato(contaId, periodo);
  }
}
