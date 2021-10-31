import {Connection} from "mongoose";
import adicionarPessoa from "./adicionarPessoa"

export interface MongoMigration {
    name: string;
    condition?: (db : Connection) => Promise<boolean>;
    execute: (db: Connection) => Promise<boolean>;
}


let migrations : MongoMigration[] = [
    adicionarPessoa
]

export default migrations
