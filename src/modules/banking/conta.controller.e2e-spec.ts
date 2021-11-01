import {setupApp} from "../../setup";

require('dotenv').config({path: '.env.test'});
import {Model} from "mongoose";
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../../app.module';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {getMockConta, getRandomMockTransactions, getRandomMongoId} from "./mocks";
import {getModelToken} from "@nestjs/mongoose";
import {sortBy} from "lodash"

describe('ContaController (e2e)', () => {
    let app: INestApplication;
    let mongod;
    let httpServer;


    let contaModel: Model<any>;
    let pessoaModel: Model<any>;
    let transacaoModel: Model<any>;


    beforeAll(async () => {

        // Configura a instancia do banco de dados de teste
        if (process.env.USE_IN_MEMORY_MONGO)
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
    });

    afterAll(async () => {
        if (process.env.USE_IN_MEMORY_MONGO)
            await mongod.stop();

        await app.close()


    })

    describe("Banco de dados", () => {
        it(`Deve existir pelo menos uma pessoa cadastrada no banco de dados`, async  () => {
            expect((await pessoaModel.find({})).length).toBeGreaterThan(0)
        })
    })

    describe("/saldo/:contaid", () => {

        it('Não deve ser possível obter saldo de conta inexistente', async () => {
            let response = await request(httpServer).get('/api/banking/conta/saldo/112233445566112233445566')

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        });


        it('O saldo deve ser o mesmo registrado no banco de dados', async () => {
            // Registra uma conta mock
            let mockData = getMockConta()
            let {_id}: any = await contaModel.create(mockData)


            let response = await request(httpServer).get(`/api/banking/conta/saldo/${_id}`)

            expect(response.status).toBe(200)
            expect(response.body.saldo).toBe(mockData.saldo)

        });

    })

    describe(`/extrato/:contaId`, () => {

        it('Não deve ser possível obter extrato de conta inexistente', async () => {
            let response = await request(httpServer).get('/api/banking/conta/extrato/112233445566112233445566')

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        });


        it('Deve ser possível obter todo o extrato', async () => {
            // Cria uma conta mock
            let conta = await contaModel.create(getMockConta())

            // Adiciona várias transaçoes mock à conta
            let transactions = getRandomMockTransactions(conta._id)
            await transacaoModel.create(transactions)


            let response = await request(httpServer).get(`/api/banking/conta/extrato/${conta._id}`)


            expect(response.status).toBe(200)
            expect(sortBy(response.body, "dataTransacao")).toMatchObject(transactions)

        });


        it('Deve ser possível filtrar a obtenção do extrato', async () => {
            // Cria uma conta mock
            let conta = await contaModel.create(getMockConta())

            // Adiciona várias transaçoes mock à conta
            let transactions = [{
                "conta": `${conta._id}`,
                "valor": 74,
                "dataTransacao": "2011-07-03T16:47:48.104Z"
            }, {
                "conta": `${conta._id}`,
                "valor": 48,
                "dataTransacao": "2013-11-18T11:45:26.232Z"
            }, {
                "conta": `${conta._id}`,
                "valor": 86,
                "dataTransacao": "2014-03-16T13:30:53.331Z"
            }]
            await transacaoModel.create(transactions)


            // Filtra começando pela data do meio
            let response = await request(httpServer).get(`/api/banking/conta/extrato/${conta._id}?inicioPeriodo=2013-11-18T11:45:26.232Z`)


            let expected = [{
                "conta": `${conta._id}`,
                "valor": 48,
                "dataTransacao": "2013-11-18T11:45:26.232Z"
            }, {
                "conta": `${conta._id}`,
                "valor": 86,
                "dataTransacao": "2014-03-16T13:30:53.331Z"
            }]

            expect(response.status).toBe(200)
            expect(sortBy(response.body, "dataTransacao")).toMatchObject(expected)


            // Repete o filtro anterior e adiciona fim do periodo como sendo 16/12/2013
            response = await request(httpServer).get(`/api/banking/conta/extrato/${conta._id}?inicioPeriodo=2013-11-18T11:45:26.232Z&fimPeriodo=2013-12-16T12:30:53.331Z`)


            expected = [{
                "conta": `${conta._id}`,
                "valor": 48,
                "dataTransacao": "2013-11-18T11:45:26.232Z"
            }]

            expect(response.status).toBe(200)
            expect(sortBy(response.body, "dataTransacao")).toMatchObject(expected)

        });
    })

    describe(`/criar`, () => {

        it(`Deve ser possível criar uma conta`, async ()=>{

            let criarContaInput = {
                pessoa: `112233445566112233445566`,
                limiteSaqueDiario: 500,
                flagAtivo: true,
                tipoConta: 1,
            }

            let response = await request(httpServer).post('/api/banking/conta/criar').send(criarContaInput)

            expect(response.status).toBe(201)

            expect(response.body).toMatchObject(criarContaInput)

            expect(response.body._id).toBeDefined()

            let contaNoBancoDeDados = (await contaModel.findOne({_id: response.body._id})).toObject()

            contaNoBancoDeDados.pessoa = contaNoBancoDeDados.pessoa.toString()

            expect(contaNoBancoDeDados).toMatchObject(criarContaInput)


        })

        it(`Não deve ser possível criar mais de uma conta por pessoa`,  async()=>{

            let criarContaInput = {
                pessoa: `112233445566112233445566`,
                limiteSaqueDiario: 500,
                flagAtivo: true,
                tipoConta: 1,
            }

            let response1 = await request(httpServer).post('/api/banking/conta/criar').send(criarContaInput)

            expect(response1.status).toBe(201)

            let response2 = await request(httpServer).post('/api/banking/conta/criar').send(criarContaInput)

            expect(response2.status).toBe(400)

            expect(response2.body).toMatchObject({message: "A pessoa já possui uma conta."})


        })
    })

    describe(`/depositar-valor`, ()=>{

        it("Deve ser possível depositar valores na conta", async () => {
            // Cria uma conta de testes.
            let contaId = (await contaModel.create(getMockConta({saldo: 0})))._id

            // A conta começa com 0 de saldo.
            let response = await request(httpServer).post(`/api/banking/conta/depositar-valor`).send({
                conta: contaId,
                valor: 1000
            })

            let {novoSaldo} = response.body

            expect(novoSaldo).toBe(1000)

            // Confere o saldo da conta no banco

            let conta = await contaModel.findOne({_id: contaId}).select('saldo')

            expect(conta.saldo).toBe(1000)


            response = await request(httpServer).post(`/api/banking/conta/depositar-valor`).send({
                conta: contaId,
                valor: 1000
            })

            novoSaldo = response.body.novoSaldo

            expect(novoSaldo).toBe(2000)

            // Confere o saldo da conta no banco

            conta = await contaModel.findOne({_id: contaId}).select('saldo')

            expect(conta.saldo).toBe(2000)
        })

        it("Não deve ser possível depositar dinheiro em uma conta inativa", async () => {
            // Cria uma conta de testes.
            let contaId = (await contaModel.create(getMockConta({saldo: 0, flagAtivo: false})))._id

            // A conta começa com 0 de saldo.
            let response = await request(httpServer).post(`/api/banking/conta/depositar-valor`).send({
                conta: contaId,
                valor: 1000
            })

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })
        })

        it("Não deve ser possível depositar dinheiro em uma conta inexistente", async () => {
            // A conta começa com 0 de saldo.
            let response = await request(httpServer).post(`/api/banking/conta/depositar-valor`).send({
                conta: `112233445566112233445500`,
                valor: 1000
            })

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })
        })

    })

    describe(`/sacar-valor`, ()=>{

        it("Deve ser possível sacar valores da conta", async () => {
            // Cria uma conta de testes com saldo inicial de 1000 e limite de saque diário de 500
            let contaId = (await contaModel.create(getMockConta({saldo: 1000, limiteSaqueDiario: 500})))._id

            // Faz um saque de 200
            let response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 200
            })

            let {novoSaldo} = response.body

            expect(novoSaldo).toBe(800)

            // Confere o saldo da conta no banco

            let {saldo} = await contaModel.findOne({_id: contaId}).select('saldo')

            expect(saldo).toBe(800)

        })

        it("Não deve ser possível sacar valores de conta inativa", async () => {
            // Cria uma conta de testes com saldo inicial de 1000 e limite de saque diário de 500
            let contaId = (await contaModel.create(getMockConta({saldo: 1000, limiteSaqueDiario: 500, flagAtivo: false})))._id

            // Solicita um saque de 2000
            let response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 200
            })

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        })

        it("Não deve ser possível sacar valores de conta inexistente", async () => {
            // Solicita um saque de 2000
            let response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: `112233445566112233445500`,
                valor: 200
            })

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        })

        it("Não deve ser possível sacar valores maiores que o saldo", async () => {
            // Cria uma conta de testes com saldo inicial de 1000 e limite de saque diário de 500
            let contaId = (await contaModel.create(getMockConta({saldo: 1000, limiteSaqueDiario: 500})))._id

            // Solicita um saque de 2000
            let response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 2000
            })


            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        })

        it("Não deve ser possível sacar valores maiores que o limite diário", async () => {
            // Cria uma conta de testes com saldo inicial de 1000 e limite de saque diário de 500
            let contaId = (await contaModel.create(getMockConta({saldo: 1000, limiteSaqueDiario: 500})))._id

            // Solicita um saque de 700
            let response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 700
            })


            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        })

        it("O limite diário deve ser respeitado", async () => {
            // Cria uma conta de testes com saldo inicial de 1000 e limite de saque diário de 500
            let contaId = (await contaModel.create(getMockConta({saldo: 1000, limiteSaqueDiario: 500})))._id

            let response;
            // Limite: 500
            // Solicita um saque de 200
            response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 200
            })
            expect(response.status).toBe(201)

            // Limite: 300
            // Solicita um saque de 200
            response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 200
            })
            expect(response.status).toBe(201)


            // Limite: 100
            // Solicita um saque de 200
            response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 200
            })

            expect(response.status).toBe(400)
            expect(response.body).toMatchObject({
                error: "Bad Request"
            })

        })

        it("As transações ocupam o limite diário somente durante 24 horas após sua realização", async () => {
            // Cria uma conta de testes com saldo inicial de 1000 e limite de saque diário de 500
            let contaId = (await contaModel.create(getMockConta({saldo: 1000, limiteSaqueDiario: 500})))._id

            // Registra uma transação que foi efetuada 24 horas atrás
            await transacaoModel.create({
                conta: contaId,
                valor: 500,
                dataTransacao: new Date(Date.now() - 24 * 60 * 60 * 1000)
            })

            let response;
            // Limite: 500
            // Solicita um saque de 500
            response = await request(httpServer).post(`/api/banking/conta/sacar-valor`).send({
                conta: contaId,
                valor: 500
            })
            expect(response.status).toBe(201)
            expect(response.body).toMatchObject({
                novoSaldo: 500
            })


        })
    })


    describe(`/bloquear-conta`, () => {

        it("Deve ser possível bloquear a conta", async () => {
            // Cria uma conta de testes
            let contaId = (await contaModel.create(getMockConta({flagAtivo: true})))._id

            // Solicita bloqueio
            let response = await request(httpServer).post(`/api/banking/conta/bloquear`).send({
                conta: contaId,
            })


            let {flagAtivo} = await contaModel.findOne({_id: contaId}).select('flagAtivo')

            expect(flagAtivo).toBe(false)


        })


        it("Não deve ser possível bloquear conta inexistente", async () => {
            // Solicita bloqueio
            let response = await request(httpServer).post(`/api/banking/conta/bloquear`).send({
                conta: `112233445566112233445500`,
            })

            expect(response.status).toBe(400)


        })

    })

});
