import { Injectable } from '@nestjs/common';
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
