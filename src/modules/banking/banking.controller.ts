import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {
    BloquearContaValidator,
    CriarContaValidator,
    DepositarValorValidator,
    SacarValorValidator
} from "./banking.controller.dtos";
import * as mongoose from "mongoose";


@Controller('banking')
export class BankingController {

    @Post(`/criar-conta`)
    criarConta(@Body() {pessoa, limiteSaqueDiario, flagAtivo, tipoConta}: CriarContaValidator) {

    }

    @Post(`/depositar-valor`)
    depositarValor(@Body() {conta, valor}: DepositarValorValidator) {

    }

    @Post(`/sacar-valor`)
    sacarValor(@Body() {conta, valor}: SacarValorValidator) {

    }

    @Post(`/bloquear-conta`)
    bloquearConta(@Body() {conta} : BloquearContaValidator ) {

    }

    @Get(`/consultar-saldo/:contaId`)
    consultarSaldo(@Param(`contaId`) conta: string) {
        // Faz validação manual do id
        let isAccountValid = mongoose.Types.ObjectId.isValid(conta);


    }

    @Get(`extrato-conta/:contaId`)
    extratoConta(@Param(`contaId`) conta: string,
                 @Query(`inicioPeriodo`) inicioPeriodo: string,
                 @Query('fimPeriodo') filoPeriodo: string) {
        // Faz validação manual do id e das Date Time ISO strings.
        let isAccountValid = mongoose.Types.ObjectId.isValid(conta);


    }


}




