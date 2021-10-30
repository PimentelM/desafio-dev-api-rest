require('dotenv').config({ path:  '.env.test.with.cloud.db' });
import {Connection, Model} from "mongoose";
import {DatabaseService} from "../../database/database.service";
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../../../app.module';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {setupApp} from "../../../main";
import {getMockConta, getRandomMongoId} from "./mocks";
import {getModelToken} from "@nestjs/mongoose";

describe('ContaController (e2e)', () => {
    let app: INestApplication;
    let mongod;
    let httpServer;


    let contaModel: Model<any>;
    let pessoaModel: Model<any>;
    let transacaoModel: Model<any>;


    beforeAll(async () => {

        // Configura a instancia do banco de dados de teste
        if(process.env.use_in_memory_mongo)
        mongod = await MongoMemoryServer.create(
            {
                instance: {
                    dbName: "test",
                    port: 6733
                }
            })

        // Cria módulo de testes
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        // Cria instância da aplicação
        app = moduleFixture.createNestApplication();

        // Configura as opções que utilizamos na aplicação original
        await setupApp(app)

        // Inicializa a aplicação
        await app.init();

        httpServer = app.getHttpServer()

        // Obtém referências aos models utilizados
        contaModel = moduleFixture.get<Model<any>>(getModelToken(`Conta`))
        transacaoModel = moduleFixture.get<Model<any>>(getModelToken(`Transacao`))
        pessoaModel = moduleFixture.get<Model<any>>(getModelToken(`Pessoa`))

    })

    beforeEach(async () => {
        // Limpa o banco de dados antes de cada teste
        await contaModel.deleteMany({})
        await transacaoModel.deleteMany({})
        await pessoaModel.deleteMany({})
    });

    afterAll(async () => {
        if(process.env.use_in_memory_mongo)
        await mongod.stop();
    })

    describe("Obter Saldo", () => {

        it('Não deve ser possível obter saldo de conta inexistente', async () => {
            let response = await request(httpServer).get('/api/banking/conta/saldo/112233445566112233445566')

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        });


        it('O saldo deve ser o mesmo registrado no banco de dados', async () => {
            // Registra um usuário mock
            let {_id} : any = await contaModel.create(getMockConta())


            let response = await request(httpServer).get(`/api/banking/conta/saldo/${_id}`)

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({saldo: getMockConta().saldo } )

        });

    })




});
