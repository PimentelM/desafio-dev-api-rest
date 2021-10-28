import {Global, Inject, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {configs} from "../../configs";
import {models} from "../../models";

@Global()
@Module({
    imports: [
        MongooseModule.forRoot(configs.app.database),
        MongooseModule.forFeature(models)
    ],
    providers: [],
    exports: [MongooseModule],
})
export class DatabaseModule  {}
