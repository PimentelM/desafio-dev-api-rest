import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ParseObjectIdPipe} from "../../pipes/ParseObjectIdPipe";
import {ParseDateTimePipe} from "../../pipes/ParseDateTimePipe";
import {BankingService} from "./banking.service";
import {
    BloquearContaValidator,
    CriarContaValidator,
    DepositarValorValidator,
    SacarValorValidator
} from "./banking.controller.validators";


@Controller('management')
export class BankingController {

    constructor(private bankingService: BankingService){}

    @Post(`/criar-conta`)
    criarConta(@Body() {pessoa, limiteSaqueDiario, flagAtivo, tipoConta}: CriarContaValidator) {
        return this.bankingService.criarConta(pessoa,limiteSaqueDiario,flagAtivo,tipoConta)
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
        return this.bankingService.bloquearconta(conta)
    }

    @Get(`/consultar-saldo/:contaId`)
    consultarSaldo(@Param(`contaId`, ParseObjectIdPipe) conta: string) {
        return this.bankingService.consultarSaldo(conta)
    }

    @Get(`/extrato-conta/:contaId`)
    extratoConta(@Param(`contaId`, ParseObjectIdPipe) conta: string,
                 @Query(`inicioPeriodo`, ParseDateTimePipe) inicioPeriodo?: Date,
                 @Query('fimPeriodo', ParseDateTimePipe) fimPeriodo?: Date) {

        return this.bankingService.obterExtrato(conta,{
            inicio: inicioPeriodo,
            fim: fimPeriodo
        })

    }


}




