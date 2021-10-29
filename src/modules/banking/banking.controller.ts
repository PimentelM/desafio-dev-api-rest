import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {
    BloquearContaValidator,
    CriarContaValidator,
    DepositarValorValidator,
    SacarValorValidator
} from "./banking.controller.validators";
import * as mongoose from "mongoose";
import {ParseObjectIdPipe} from "../../pipes/ParseObjectIdPipe";
import {ParseDateTimePipe} from "../../pipes/ParseDateTimePipe";
import {BankingService} from "./banking.service";
import {BankingRepository} from "./banking.repository";


@Controller('management')
export class BankingController {

    constructor(private bankingService: BankingService, private bankingRepository: BankingRepository){}

    @Post(`/criar-conta`)
    criarConta(@Body() {pessoa, limiteSaqueDiario, flagAtivo, tipoConta}: CriarContaValidator) {
        return this.bankingRepository.criarConta(pessoa,limiteSaqueDiario,flagAtivo,tipoConta)
    }

    @Post(`/depositar-valor`)
    depositarValor(@Body() {conta, valor}: DepositarValorValidator) {
        return this.bankingService.depositarValor(conta,valor)
    }

    @Post(`/sacar-valor`)
    sacarValor(@Body() {conta, valor}: SacarValorValidator) {
        return this.bankingService.sacarValor(conta,valor)
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




