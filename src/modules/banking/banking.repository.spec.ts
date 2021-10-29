import { Test, TestingModule } from '@nestjs/testing';
import { BankingRepository } from './banking.repository';

describe('BankingRepository', () => {
  let service: BankingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankingRepository],
    }).compile();

    service = module.get<BankingRepository>(BankingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
