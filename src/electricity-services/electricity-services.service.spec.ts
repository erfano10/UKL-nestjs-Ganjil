import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityServicesService } from './electricity-services.service.js';

describe('ElectricityServicesService', () => {
  let service: ElectricityServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElectricityServicesService],
    }).compile();

    service = module.get<ElectricityServicesService>(ElectricityServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
