require('dotenv').config({ path:  '.env.test' });
import {DatabaseService} from "../src/modules/database/database.service";
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {setupApp} from "../src/main";

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let mongod;
    let dbConnection;

    beforeAll(async () => {
        // Configura a instancia do banco de dados de teste
        mongod = await MongoMemoryServer.create(
            {
                instance: {
                    dbName: "test",
                    port: 6733
                }
            })
    })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Configura as opções que utilizamos na aplicação original
        await setupApp(app)

        // Inicializa a aplicação
        await app.init();

        // Obtém referência à conexão do banco de dados
        dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbConnection()
    });

    afterAll(async () => {
        await mongod.stop();
    })

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(404)
            .expect({
                statusCode: 404,
                message: "Cannot GET /",
                error: "Not Found"
            });
    });





});
