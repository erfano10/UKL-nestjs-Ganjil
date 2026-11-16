import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ElectricityServicesService } from './electricity-services.service.js';
import { CreateElectricityServiceDto } from './dto/create-electricity-service.dto.js';
import { UpdateElectricityServiceDto } from './dto/update-electricity-service.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('electricity-services')
export class ElectricityServicesController {
  constructor(private readonly electricityServicesService: ElectricityServicesService) { }

  
  @Post()
  create(@Body() createElectricityServiceDto: CreateElectricityServiceDto) {
    return this.electricityServicesService.create(createElectricityServiceDto);
  }

  @Get()
  findAll(@Req() req : any) {
    const userRole = req.user.role
    return this.electricityServicesService.findAll(userRole);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electricityServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateElectricityServiceDto: UpdateElectricityServiceDto) {
    return this.electricityServicesService.update(+id, updateElectricityServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electricityServicesService.remove(+id);
  }
}
