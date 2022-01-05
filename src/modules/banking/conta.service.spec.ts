import { Test, TestingModule } from '@nestjs/testing';
import { ContaService } from './conta.service';
import { ContaRepository } from './conta.repository';
import { getMockConta, getRandomMongoId } from './mocks';

describe('ContaService', () => {
  let service: ContaService;
  let mockRepository: any = {};

  beforeEach(async () => {
    // Reseta a definição do mock repository
    mockRepository = {};

    // Cria uma instancia do serviço utilizando o mock repository
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContaService,
        {
          provide: ContaRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContaService>(ContaService);
  });

  describe('Exemplos de teste unitário', () => {
    describe('Sacar Valor', () => {
      beforeEach(() => {
        // Redefine funções do repositório antes de cada teste
        mockRepository.getContaById = (id) =>
          getMockConta({ saldo: 100, flagAtivo: true, limiteSaqueDiario: 50 });
        mockRepository.getSaquesDoDia = (conta) => [];
        mockRepository.realizarTransacao = jest.fn();
      });

      it('A conta deve existir para que o saque seja realizado', async () => {
        // Redefine a função que obtem contas do repositório
        mockRepository.getContaById = (id) => undefined;

        let action = async () =>
          await service.sacarValor(`112233445566112233445566`, 10);

        await expect(action).rejects.toThrow(/.*conta inexistente.*/i);
      });

      it('A conta deve estar ativa para que o saque seja realizado', async () => {
        // Redefine a função que obtem contas do repositório
        mockRepository.getContaById = (id) =>
          getMockConta({ flagAtivo: false });

        let action = async () =>
          await service.sacarValor(`112233445566112233445566`, 10);

        await expect(action).rejects.toThrow(/.*conta inativa.*/i);
      });

      it('A conta deve possuir saldo suficiente para que o saque seja realizado', async () => {
        let action = async () =>
          await service.sacarValor(`112233445566112233445566`, 200);

        await expect(action).rejects.toThrow(/.*saldo insuficiente.*/i);
      });

      it('O saque não deve ser maior que o limite de saque diário', async () => {
        let action = async () =>
          await service.sacarValor(`112233445566112233445566`, 60);

        await expect(action).rejects.toThrow(/.*limite de saque diário.*/i);
      });

      it('O cálculo do extrapolamento do limite de saque diário deve levar em conta as transações feitas no dia', async () => {
        // Redefine a função que obtem saques do dia
        mockRepository.getSaquesDoDia = (conta) => [
          { conta, valor: 20 },
          { conta, valor: 20 },
        ];

        // Limite diário: 50, restante: 10, solicitado: 20
        let action = async () =>
          await service.sacarValor(`112233445566112233445566`, 20);

        await expect(action).rejects.toThrow(/.*limite de saque diário.*/i);
      });

      it('Deve ser possível sacar valor', async () => {
        // Redefine a função que obtem saques do dia
        mockRepository.getSaquesDoDia = (conta) => [];

        // Limite diário: 50, restante: 50, solicitado: 20
        await service.sacarValor(`112233445566112233445566`, 20);

        // Transação com valor negativo por ser um saque
        expect(mockRepository.realizarTransacao).toHaveBeenLastCalledWith(
          `112233445566112233445566`,
          -20,
        );
      });
    });
  });
});
