import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateElectricityServiceDto } from './dto/create-electricity-service.dto.js';
import { UpdateElectricityServiceDto } from './dto/update-electricity-service.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ElectricityServicesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createElectricityServiceDto: CreateElectricityServiceDto) {
    const { code, name, power_va, price_per_kwh, is_active } = createElectricityServiceDto

    const existingCode = await this.prisma.electricity_services.findFirst({ where: { code } })

    if (existingCode) {
      throw new ConflictException(` Service code already exist`)
    }

    const newService = await this.prisma.electricity_services.create({
      data: {
        code, name, power_va, price_per_kwh, is_active
      }
    })
    return {
      message: 'Berhasil membuat layanan listrik baru',
      data: newService
    }
  }

  async findAll(role: string) {
    const filter = role === 'COSTUMER' ? { is_active: true } : {}
    const services = await this.prisma.electricity_services.findMany({ where: filter })

    return {
      message: 'Berhasil mengambil daftar layanan listrik',
      data: services
    }
  }

  async findOne(id: number) {
    const service = await this.prisma.electricity_services.findFirst({ where: { id } })

    if (!service) {
      throw new NotFoundException('Electricity service not found')
    }
    return {
      message : 'Berhasil mendapatkan detail layanan listrik',
      data : service
    }
  }

  async update(id: number, updateElectricityServiceDto: UpdateElectricityServiceDto) {
    const { code, name, power_va, price_per_kwh, is_active } = updateElectricityServiceDto

    const existingService = await this.prisma.electricity_services.findFirst({ where: { id } })

    if (!existingService) {
      throw new NotFoundException('service code not found')
    }

    const newService = await this.prisma.electricity_services.update({
      where: { id },
      data: {
        code, name, power_va, price_per_kwh, is_active
      }
    })
    return {
      message: `Electricity berhasil update`,
      data: newService
    }
  }

  async remove(id: number) {
    const existingService = await this.prisma.electricity_services.findFirst({ where: { id } })

    if (!existingService) {
      throw new NotFoundException(`Electricity not found`)
    }

    const deletedService = await this.prisma.electricity_services.delete({ where: { id } })

    return {
      message: `Electricity service berhasil dihapus`,
      data: deletedService

    }
  }
}
