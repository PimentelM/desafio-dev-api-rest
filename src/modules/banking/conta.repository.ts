import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class ContaRepository {
  constructor(
    @InjectModel('Conta') private contaModel: Model<any>,
    @InjectModel('Transacao') private transacaoModel: Model<any>,
    @InjectConnection() private readonly dbConnection: mongoose.Connection,
  ) {}

  async criarConta(conta) {
    return this.contaModel.create(conta);
  }

  async realizarTransacao(contaId, valor) {
    // Inicia uma sessão no mongodb, utilizada para realizar operações atômicas.
    const session = await this.dbConnection.startSession();

    let result;

    // Define e executa uma operação atômica
    await session.withTransaction(async () => {
      // Cria um registro de transação com o valor especificado para a conta da pessoa
      let transacao = await this.transacaoModel.create({
        conta: contaId,
        valor,
        dataTransacao: Date.now(),
      });

      // Atualiza o saldo na conta
      await this.contaModel.findOneAndUpdate(
        { _id: contaId },
        { $inc: { saldo: valor } },
      );

      // Consulta o novo saldo
      let novoSaldo = (
        await this.contaModel.findOne({ _id: contaId }).select('saldo')
      ).saldo;

      // Define objeto de retorno
      result = {
        novoSaldo,
        transacao: transacao._id,
      };
    });

    // Finaliza a sessão
    await session.endSession();

    // Retorna o resultado
    return result;
  }

  async bloquearConta(contaId: string) {
    await this.contaModel.findOneAndUpdate(
      { _id: contaId },
      { $set: { flagAtivo: false } },
    );
  }

  async getSaquesDoDia(contaId: string) {
    return this.transacaoModel
      .find({
        conta: contaId,
        valor: { $lt: 0 },
        dataTransacao: { $gt: Date.now() - 1000 * 60 * 60 * 24 },
      })
      .select(`valor`);
  }

  async getContaById(contaId: string) {
    return await this.contaModel.findOne({ _id: contaId });
  }

  async getContaByPessoa(pessoaId: string) {
    return await this.contaModel.findOne({ pessoa: pessoaId });
  }

  async getExtrato(contaId: string, periodo: { inicio: Date; fim: Date }) {
    let conditions: any[] = [{ conta: contaId }];

    if (periodo.inicio) {
      conditions.push({
        dataTransacao: { $gte: periodo.inicio },
      });
    }

    if (periodo.fim) {
      conditions.push({
        dataTransacao: { $lte: periodo.fim },
      });
    }

    return this.transacaoModel.find({
      $and: conditions,
    });
  }
}
