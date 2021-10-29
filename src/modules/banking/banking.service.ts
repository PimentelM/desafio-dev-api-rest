import {BadRequestException, Injectable} from '@nestjs/common';
import {BankingRepository} from "./banking.repository";

@Injectable()
export class BankingService {

    constructor(
        private bankingRepository: BankingRepository
    ) {}



    async depositarValor(contaId, valor) {
        if(valor <= 0) throw new BadRequestException("O valor do depósito deve ser positivo")

        // Faz verificações sobre a conta
        let conta = await this.bankingRepository.obterConta(contaId)
        if(!conta) throw new BadRequestException("Conta inexistente")
        if(!conta.flagAtivo) throw new BadRequestException("Conta Inativa")

        return await this.bankingRepository.executarTransacao(contaId,valor)

    }


    async sacarValor(contaId, valor) {
        if(valor <= 0) throw new BadRequestException("O valor do saque deve ser positivo")

        // Faz verificações sobre a conta
        let conta = await this.bankingRepository.obterConta(contaId)
        if(!conta) throw new BadRequestException("Conta inexistente")
        if(!conta.flagAtivo) throw new BadRequestException("Conta Inativa")

        // Faz verificações à cerca do saldo
        if(conta.saldo < valor) throw new BadRequestException("Saldo insuficiente")

        // Obtém lista dos saques feitos nas ultimas 24 horas.
        let saquesDoDia = await this.bankingRepository.obterSaquesDoDia(contaId)

        // Faz a somatória dos valores e obtém o valor absoluto
        let somatoriaSaquesDoDia = Math.abs(saquesDoDia.reduce((a,x)=> a + x.valor ,0) )

        // Faz verificações sobre o limite de saque diário
        if( somatoriaSaquesDoDia + valor > conta.limiteSaqueDiario)
            throw new BadRequestException("Sacar este valor excederá o limite de saque diário")

        // Executa a transação com o valor negativo
        return await this.bankingRepository.executarTransacao(contaId, valor * -1)

    }



}
