import {IsBoolean, IsNotEmpty, IsNumber, IsPositive} from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";

// Aqui nós definimos as classes do tipo "Data To Object"
// Elas são usadas para converter os dados vindo do usuário em objetos tipados
// O DTO pode ser utilizado para inserir validações e metadados adicionais
export class CriarContaValidator {
    @IsNotEmpty()
    @IsObjectId()
    pessoa: string

    @IsNotEmpty()
    @IsNumber()
    limiteSaqueDiario: number

    @IsNotEmpty()
    @IsBoolean()
    flagAtivo: boolean

    @IsNotEmpty()
    @IsNumber()
    tipoConta: number
}

export class BloquearContaValidator {
    @IsNotEmpty()
    @IsObjectId()
    conta: string
}

export class DepositarValorValidator {
    @IsNotEmpty()
    @IsObjectId()
    conta: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    valor: number
}

export class SacarValorValidator {
    @IsNotEmpty()
    @IsObjectId()
    conta: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    valor: number
}
