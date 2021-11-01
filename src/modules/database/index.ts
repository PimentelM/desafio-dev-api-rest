import {Global, Inject, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {configs} from "../../configs";
import {models} from "./models";
import {DatabaseService} from "./database.service";
import {MongoMemoryServer} from "mongodb-memory-server";
import {MigrationService} from "./migration.service";

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => {
                if(configs.app.database)
                    return {
                        uri: configs.app.database
                    }

                // Caso esteja em produção, o recurso MongoMemoryServer não poderá ser utilizado.
                if(process.env.NODE_ENV === 'production') throw new Error("Banco de dados não especificado.")

                console.warn("String de conexão com o banco de dados não especificada. Utilizando versão volátil do banco de dados, que perderá seus dados ao finalizar o processo da aplicação.")

                await MongoMemoryServer.create(
                    {
                        instance: {
                            dbName: "volatile-db",
                            port: 6733
                        }
                    })

                return {
                    uri: `mongodb://127.0.0.1:6733/volatile-db`
                }

            }
        }),
        MongooseModule.forFeature(models)
    ],
    providers: [DatabaseService, MigrationService],
    exports: [MongooseModule],
})
export class DatabaseModule  {}
