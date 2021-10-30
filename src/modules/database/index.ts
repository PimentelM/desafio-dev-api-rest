import {Global, Inject, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {configs} from "../../configs";
import {models} from "../../models";
import {DatabaseService} from "./database.service";

@Global()
@Module({
    imports: [
        MongooseModule.forRoot(configs.app.database),
        MongooseModule.forFeature(models)
    ],
    providers: [DatabaseService],
    exports: [MongooseModule],
})
export class DatabaseModule  {}
