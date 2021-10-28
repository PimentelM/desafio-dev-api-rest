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
        // Inicialmente será possível criar apenas uma conta por pessoa
        if(await this.contaModel.findOne({pessoa})) throw new BadRequestException(`A pessoa já possui uma conta.`)

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


            // Consulta o novo saldo
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


    async sacarValor(contaId, valor) {
        if(valor <= 0) throw new BadRequestException("O valor do saque deve ser positivo")

        // Faz verificações sobre a conta
        let conta = await this.contaModel.findOne({_id: contaId})
        if(!conta) throw new BadRequestException("Conta inexistente")
        if(!conta.flagAtivo) throw new BadRequestException("Conta Inativa")

        // Faz verificações à cerca do saldo
        if(conta.saldo < valor) throw new BadRequestException("Saldo insuficiente")

        // Obtém lista dos saques feitos nas ultimas 24 horas.
        let saquesDoDia = await this.transacaoModel.find({
                conta: conta._id,
                valor: { $lt: 0},
                dataTransacao: {$gt : Date.now() - 1000 * 60 * 60 * 24}
            }).select(`valor`)

        // Faz a somatória dos valores e obtém o valor absoluto
        let somatoriaSaquesDoDia = Math.abs(saquesDoDia.reduce((a,x)=> a + x.valor ,0) )

        // Faz verificações sobre o limite de saque diário
        if( somatoriaSaquesDoDia + valor > conta.limiteSaqueDiario)
            throw new BadRequestException("Sacar este valor excederá o limite de saque diário")


        // Inicia uma sessão no mongodb, utilizada para realizar operações atômicas.
        const session = await this.dbConnection.startSession();

        let result;

        // Define e executa uma operação atômica
        await session.withTransaction(async () => {
            // Cria um registro de transação com o negativo do valor especificado.
            let transacao = await this.transacaoModel.create({
                conta: contaId,
                valor: valor * -1,
                dataTransacao: Date.now()
            })

            // Atualiza o saldo na conta
            await this.contaModel.findOneAndUpdate({_id: contaId}, { $inc : { saldo: valor * -1}})


            // Consulta o novo saldo
            let novoSaldo = (await this.contaModel.findOne({_id :contaId}).select("saldo")).saldo

            // Define objeto de retorno
            result = {
                novoSaldo,
                transacao: transacao._id,
            }
        })

        // Finaliza a sessão
        await session.endSession();

        // Retorna o resultado
        return result

    }



}
