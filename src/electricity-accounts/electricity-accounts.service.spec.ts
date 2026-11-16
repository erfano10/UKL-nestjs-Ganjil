import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityAccountsService } from './electricity-accounts.service.js';

describe('ElectricityAccountsService', () => {
  let service: ElectricityAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElectricityAccountsService],
    }).compile();

    service = module.get<ElectricityAccountsService>(ElectricityAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
