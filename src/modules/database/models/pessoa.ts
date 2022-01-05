import { Schema } from 'mongoose';
import { ModelDefinition } from './index';

/*
   O campo idPessoa foi removido em detrimento do _id, presente em todos os registros do MongoDb
   O campo idPessoa foi substituido por pessoa, para aderir à convenção mais utilizada no MongoDb
 */

let model: ModelDefinition = {
  name: 'Pessoa',
  schema: {
    nome: { type: String, required: true, trim: true },
    cpf: { type: String, required: true, trim: true, unique: true },
    dataNascimento: { type: Date, required: true },
  },
};

export default model;
