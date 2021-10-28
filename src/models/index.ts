import * as mongoose from "mongoose";
import {Schema, SchemaDefinition, SchemaOptions} from "mongoose";
import Conta from "./conta";
import Pessoa from "./pessoa";
import Transacao from "./transacao";

// Usamos esta interface para padronizar a definição dos models das entidades do sistema
export interface ModelDefinition {
    name: string,
    schema: SchemaDefinition,
    options?: SchemaOptions,
}

// Schema já compilado
interface CompiledModelDefinition {name: string, schema: Schema}

// Lista com todas os models que devem ser registrados no sistema
let modelDefinitions: ModelDefinition[] = [
    Conta,
    Pessoa,
    Transacao
]

// Podemos alterar esta função para lidar com eventuais definições mais complexas.
// Podendo adicionar opções padrão, campos virtuais, extensões e etc.
function makeSchema(modelDefinition: ModelDefinition) {
  return new mongoose.Schema(modelDefinition.schema, modelDefinition.options);
}


// Exporta os models com o schema já compilado, pronto para registro
export let models : CompiledModelDefinition[] =  modelDefinitions.map(compile)


function compile(model: ModelDefinition) : CompiledModelDefinition {
    return {
        name: model.name,
        schema: makeSchema(model)
    }
}
