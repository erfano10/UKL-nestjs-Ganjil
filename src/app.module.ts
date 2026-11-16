import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { SupabaseStorageModule } from './supabase-storage/supabase-storage.module.js';
import { BcryptModule } from './bcrypt/bcrypt.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ElectricityServicesModule } from './electricity-services/electricity-services.module.js';
import { ElectricityAccountsModule } from './electricity-accounts/electricity-accounts.module.js';
import { BillingsModule } from './billings/billings.module.js';
import { PaymentsModule } from './payments/payments.module.js';


@Module({
  imports: [PrismaModule,ConfigModule.forRoot({ isGlobal: true }), SupabaseStorageModule, BcryptModule, AuthModule, ElectricityServicesModule, ElectricityAccountsModule, BillingsModule, PaymentsModule, ] ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
