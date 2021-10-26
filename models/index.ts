import {SchemaDefinition, SchemaOptions} from "mongoose";
import Conta from "./conta";
import Pessoa from "./pessoa";
import Transacao from "./transacao";

// Usamos esta interface para padronizar a definição dos models das entidades do sistema
export interface ModelDefinition {
    name: string,
    schema: SchemaDefinition,
    options?: SchemaOptions,
}


let modelDefinitions: ModelDefinition[] = [
    Conta,
    Pessoa,
    Transacao
]


export default modelDefinitions;
