import { Module } from '@nestjs/common';
import {ContaController} from "./conta.controller";
import {ContaService} from "./conta.service";
import {ContaRepository} from "./conta.repository";

@Module({
    imports: [],
    controllers: [ContaController],
    providers: [ContaService, ContaRepository],
})
export class BankingModule {

}

