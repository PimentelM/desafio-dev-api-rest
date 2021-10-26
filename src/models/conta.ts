import {Schema} from "mongoose";
import {ModelDefinition} from "./index";

/*
   O campo idConta foi removido em detrimento do _id, presente em todos os registros do MongoDb
   O campo idPessoa foi substituido por pessoa, para aderir à convenção mais utilizada no MongoDb
 */

let model: ModelDefinition = {
    name: "Conta",
    schema: {
        pessoa: {ref: "Pessoa", type: Schema.Types.ObjectId},
        saldo: {type: Number, required: true, default: 0},
        limiteSaqueDiario: {type: Number, required: true, default: 0},
        flagAtivo: {type: Boolean, required: true, default: false},
        tipoConta: {type: Number, required: true},
        dataCriacao: {
            type: Date,
            required: true,
            default: Date.now /* Função para ser executada em tempo de execução */
        },
    }
}

export default model
