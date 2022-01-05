import { Schema } from 'mongoose';
import { ModelDefinition } from './index';

/*
   O campo idTransacao foi removido em detrimento do _id, presente em todos os registros do MongoDb
   O campo idConta foi substituido por conta, para aderir à convenção mais utilizada no MongoDb
 */

let model: ModelDefinition = {
  name: 'Transacao',
  schema: {
    conta: { ref: 'Conta', type: Schema.Types.ObjectId },
    valor: { type: Number, required: true },
    dataTransacao: {
      type: Date,
      required: true,
      default: Date.now /* Função para ser executada em tempo de execução */,
    },
  },
};

export default model;
