import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {
    BloquearContaValidator,
    CriarContaValidator,
    DepositarValorValidator,
    SacarValorValidator
} from "./banking.controller.dtos";
import * as mongoose from "mongoose";
import {ParseObjectIdPipe} from "../../pipes/ParseObjectIdPipe";
import {ParseDateTimePipe} from "../../pipes/ParseDateTimePipe";


@Controller('management')
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
    consultarSaldo(@Param(`contaId`, ParseObjectIdPipe) conta: string) {


    }

    @Get(`extrato-conta/:contaId`)
    extratoConta(@Param(`contaId`, ParseObjectIdPipe) conta: string,
                 @Query(`inicioPeriodo`, ParseDateTimePipe) inicioPeriodo: string,
                 @Query('fimPeriodo', ParseDateTimePipe) fimPeriodo: string) {


    }


}




