import { Module } from '@nestjs/common';
import { ElectricityAccountsService } from './electricity-accounts.service.js';
import { ElectricityAccountsController } from './electricity-accounts.controller.js';

@Module({
  controllers: [ElectricityAccountsController],
  providers: [ElectricityAccountsService],
})
export class ElectricityAccountsModule {}
