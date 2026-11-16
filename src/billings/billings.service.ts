import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto.js';
import { UpdateBillingDto } from './dto/update-billing.dto.js';
import { BillingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BillingsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createBillingDto: CreateBillingDto) {
    const { electricity_account_id, period_month, period_year, previous_meter, current_meter, due_date } = createBillingDto

    const account = await this.prisma.electricity_accounts.findUnique({
      where: { id: electricity_account_id },
      include: { electricityServices: true }
    })

    if (!account) {
      throw new NotFoundException('Electricity account not found');
    }
    if (current_meter < previous_meter) {
      throw new BadRequestException('Current meter cannot be less than previous meter');
    }
    const tariffPerKwh = Number(account.electricityServices.price_per_kwh)

    const consumption = current_meter - previous_meter
    const amount = consumption * tariffPerKwh

    const newBilling = await this.prisma.billings.create({
      data: {
        electricity_account_id,
        period_month,
        period_year,
        previous_meter,
        current_meter,
        consumption,
        tariff_per_kwh: tariffPerKwh,
        amount: amount,
        due_date: new Date(due_date),
        status: 'UNPAID'
      }
    })
    return {
      message: 'Berhasil membuat tagihan listrik baru',
      data: newBilling,
    }
  }

  async findAll(userId: number, role: string) {
    let billings
    if (role === 'ADMIN') {
       billings = await this.prisma.billings.findMany({
        include: {
          electricity_account: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
      });
    } else {
      return this.prisma.billings.findMany({
        where: {
          electricity_account: {
            user_id: userId,
          },
        },
        include: {
          electricity_account: true,
        },
      });
    }
    return {
      message: 'Berhasil mengambil daftar tagihan listrik',
      data: billings
    }
  }

}
