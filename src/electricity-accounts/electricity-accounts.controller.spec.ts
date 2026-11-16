import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityAccountsController } from './electricity-accounts.controller.js';
import { ElectricityAccountsService } from './electricity-accounts.service.js';

describe('ElectricityAccountsController', () => {
  let controller: ElectricityAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectricityAccountsController],
      providers: [ElectricityAccountsService],
    }).compile();

    controller = module.get<ElectricityAccountsController>(ElectricityAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
