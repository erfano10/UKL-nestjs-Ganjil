import { Module } from '@nestjs/common';
import { BillingsService } from './billings.service.js';
import { BillingsController } from './billings.controller.js';

@Module({
  controllers: [BillingsController],
  providers: [BillingsService],
})
export class BillingsModule {}
