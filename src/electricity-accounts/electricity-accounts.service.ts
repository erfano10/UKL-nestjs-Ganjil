import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateElectricityAccountDto } from './dto/create-electricity-account.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ElectricityAccountsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: number, createElectricityAccountDto: CreateElectricityAccountDto) {
    const { electricity_service_id, customer_number, costumer_name, address } = createElectricityAccountDto

    const existingAcount = await this.prisma.electricity_accounts.findFirst({ where: { customer_number } })

    if (existingAcount) {
      throw new ConflictException(' Electricity account already exist')
    }

    const service = await this.prisma.electricity_services.findUnique({ where: { id: electricity_service_id } })
    if (!service) {
      throw new NotFoundException('Electricity not found')
    }

    const newAccount = await this.prisma.electricity_accounts.create({
      data: {
        ...createElectricityAccountDto,electricity_service_id: Number(createElectricityAccountDto.electricity_service_id), user_id: userId, status: 'ACTIVE'
      },
      include: {
        electricityServices: true
      }

    })
    return {
      message: 'Berhasil mendaftarkan akun listrik baru',
      data: newAccount
    }

  }

  async findAll(userId: number, role: string) {
    const filter = role === 'ADMIN' ? {} : { user_id: userId }

    const accounts = await this.prisma.electricity_accounts.findMany({
      where: filter,
      include: {
        electricityServices: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    return {
      message: `Berhasil mengambil daftar akun listrik`,
      data: accounts
    }

  }

  async findOne(id: number, userId: number, role: string) {
    const account = await this.prisma.electricity_accounts.findUnique({
      where: { id  : Number(id)},
      include: {
        electricityServices: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!account) {
      throw new NotFoundException('Electricity Not Found')
    }

    if (role !== "ADMIN" && account.user_id !== userId) {
      throw new ForbiddenException('Acces denied to this electricity account')
    }
    return {
      message : 'Berhasil mengambil detail akun listrik',
      data : account
    }
  }


}
