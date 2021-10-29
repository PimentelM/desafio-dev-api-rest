import {Model} from "mongoose";
import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

// Definimos um tipo que representa um objeto contendo todos os models do banco de dados.
type ModelMap = {
    [ name: string] : Model<any>
}

// Definimos um tipo que representa uma migration
export interface MongoMigration {
    name: string;
    condition?: (db : any) => Promise<boolean>;
    execute: (db: any) => Promise<boolean>;
}



@Injectable()
export class MigrationService implements OnApplicationBootstrap {
    migrations: MongoMigration[] = []
    models: ModelMap = {}

    constructor(@InjectModel('Migration') private migrationModel: Model<any>) {

    }


    async onApplicationBootstrap(): Promise<any> {
        console.log(`Checando por migrations...`)
        for (let migration of this.migrations) {

            let { name, condition, execute } = migration;

            // Se a migration não está marcada como completa no banco de dados
            if ((await this.migrationModel.findOne({ name })) == undefined) {


                // Se a migration não possuir condição, ou se a função de execução condicional retornar true
                if (!condition || (await condition(this.models))) {
                    console.log('Executando migration ' + name);
                    if (await execute(this.models)) {
                        console.log('Migration ' + name + ' executada com sucesso');
                        // Se a migration retornar true, marcar como completa no banco de dados
                        await this.migrationModel.create({ name });
                    } else {
                        console.log('Migration ' + name + ' foi executada mas não retornou true');
                    }
                }
            }


        }


    }
}
