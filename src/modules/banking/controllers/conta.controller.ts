import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ParseObjectIdPipe} from "../../../pipes/ParseObjectIdPipe";
import {ParseDateTimePipe} from "../../../pipes/ParseDateTimePipe";
import {ContaService} from "../services/conta.service";
import {
    BloquearContaValidator,
    CriarContaValidator,
    DepositarValorValidator,
    SacarValorValidator
} from "../validators/conta.controller.validators";


@Controller('conta')
export class ContaController {

    constructor(private contaService: ContaService){}

    @Post(`/criar`)
    criarConta(@Body() {pessoa, limiteSaqueDiario, flagAtivo, tipoConta}: CriarContaValidator) {
        return this.contaService.criarConta(pessoa,limiteSaqueDiario,flagAtivo,tipoConta)
    }

    @Post(`/depositar-valor`)
    depositarValor(@Body() {conta, valor}: DepositarValorValidator) {
        return this.contaService.depositarValor(conta,valor)
    }

    @Post(`/sacar-valor`)
    sacarValor(@Body() {conta, valor}: SacarValorValidator) {
        return this.contaService.sacarValor(conta,valor)
    }

    @Post(`/bloquear`)
    bloquearConta(@Body() {conta} : BloquearContaValidator ) {
        return this.contaService.bloquearconta(conta)
    }

    @Get(`/saldo/:contaId`)
    saldoConta(@Param(`contaId`, ParseObjectIdPipe) conta: string) {
        return this.contaService.consultarSaldo(conta)
    }

    @Get(`/extrato/:contaId`)
    extratoConta(@Param(`contaId`, ParseObjectIdPipe) conta: string,
                 @Query(`inicioPeriodo`, ParseDateTimePipe) inicioPeriodo?: Date,
                 @Query('fimPeriodo', ParseDateTimePipe) fimPeriodo?: Date) {

        return this.contaService.obterExtrato(conta,{
            inicio: inicioPeriodo,
            fim: fimPeriodo
        })

    }


}




