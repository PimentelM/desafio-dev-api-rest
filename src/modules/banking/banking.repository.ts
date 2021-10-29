import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as mongoose from "mongoose";

@Injectable()
export class BankingRepository {

    constructor(
        @InjectModel('Conta') private contaModel : Model<any>,
        @InjectModel('Transacao') private transacaoModel : Model<any>,
        @InjectConnection() private readonly dbConnection: mongoose.Connection,
    ) {}


    async criarConta(pessoa: string, limiteSaqueDiario : number, flagAtivo: boolean, tipoConta: number){
        // Inicialmente será possível criar apenas uma conta por pessoa
        if(await this.contaModel.findOne({pessoa})) throw new BadRequestException(`A pessoa já possui uma conta.`)

        return (await this.contaModel.create({
            pessoa,
            saldo: 0,
            limiteSaqueDiario,
            flagAtivo,
            tipoConta,
            dataCriacao: Date.now()
        })).toObject()
    }

    async obterConta(_id){
        return (await this.contaModel.findOne({_id})).toObject()
    }

    // Também pode ser implementado utilizando se um filtro à partir das 00:00 do dia atual no fuso horário do banco ou em UTC.
    async obterSaquesDoDia(contaId){
        return (await this.transacaoModel.find({
            conta: contaId,
            valor: {$lt: 0},
            dataTransacao: {$gt: Date.now() - 1000 * 60 * 60 * 24}
        }).select(`valor`)).map(x=>x.toObject());
    }

    async executarTransacao(contaId, valor) {

        // Inicia uma sessão no mongodb, utilizada para realizar operações atômicas.
        const session = await this.dbConnection.startSession();

        let result;

        // Define e executa uma operação atômica
        await session.withTransaction(async () => {
            // Cria um registro de transação com o valor especificado.
            let transacao = await this.transacaoModel.create({
                conta: contaId,
                valor: valor,
                dataTransacao: Date.now()
            })

            // Atualiza o saldo na conta
            await this.contaModel.findOneAndUpdate({_id: contaId}, { $inc : { saldo: valor}})


            // Consulta o novo saldo
            let novoSaldo = (await this.contaModel.findOne({_id :contaId}).select("saldo")).saldo

            // Define objeto de retorno
            result = {
                novoSaldo,
                transacao: transacao._id.toHexString(),
            }
        })

        // Finaliza a sessão
        await session.endSession();

        // Retorna o resultado
        return result

    }



}
