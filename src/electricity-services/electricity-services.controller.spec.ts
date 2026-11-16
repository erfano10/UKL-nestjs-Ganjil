import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityServicesController } from './electricity-services.controller.js';
import { ElectricityServicesService } from './electricity-services.service.js';

describe('ElectricityServicesController', () => {
  let controller: ElectricityServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectricityServicesController],
      providers: [ElectricityServicesService],
    }).compile();

    controller = module.get<ElectricityServicesController>(ElectricityServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
