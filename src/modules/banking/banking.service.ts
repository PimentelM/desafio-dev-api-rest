import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as mongoose from "mongoose";

@Injectable()
export class BankingService {

    constructor(
        @InjectModel('Conta') private contaModel : Model<any>,
        @InjectModel('Transacao') private transacaoModel : Model<any>,
        @InjectConnection() private readonly dbConnection: mongoose.Connection,
    ) {}

    async criarConta(pessoa: string, limiteSaqueDiario : number, flagAtivo: boolean, tipoConta: number){
        // Será possível criar uma quantidade indefinida de contas por pessoa.
        return await this.contaModel.create({
            pessoa,
            saldo: 0,
            limiteSaqueDiario,
            flagAtivo,
            tipoConta,
            dataCriacao: Date.now()
        })
    }

    async depositarValor(contaId, valor) {
        if(valor <= 0) throw new BadRequestException("O valor do depósito deve ser positivo")

        // Faz verificações sobre a conta
        let conta = await this.contaModel.findOne({_id: contaId})
        if(!conta) throw new BadRequestException("Conta inexistente")
        if(!conta.flagAtivo) throw new BadRequestException("Conta Inativa")

        // Inicia uma sessão no mongodb, utilizada para realizar operações atômicas.
        const session = await this.dbConnection.startSession();

        let result;

        // Define e executa uma operação atômica
        await session.withTransaction(async () => {
            // Cria um registro de transação com o valor especificado para a conta da pessoa
            let transacao = await this.transacaoModel.create({
                conta: contaId,
                valor,
                dataTransacao: Date.now()
            })

            // Atualiza o saldo na conta
            await this.contaModel.findOneAndUpdate({_id: contaId}, { $inc : { saldo: valor}})


            // Armazena o novo saldo
            let novoSaldo = (await this.contaModel.findOne({_id :contaId}).select("saldo")).saldo

            // Define objeto de retorno
            result = {
                novoSaldo,
                transacao: transacao._id
            }
        })

        // Finaliza a sessão
        await session.endSession();

        // Retorna o resultado
        return result

    }





}
