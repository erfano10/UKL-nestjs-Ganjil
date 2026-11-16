import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ElectricityAccountsService } from './electricity-accounts.service.js';
import { CreateElectricityAccountDto } from './dto/create-electricity-account.dto.js';
import { UpdateElectricityAccountDto } from './dto/update-electricity-account.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('electricity-accounts')
export class ElectricityAccountsController {
  constructor(private readonly electricityAccountsService: ElectricityAccountsService) {}

  @Post()
  create(@Body() createElectricityAccountDto: CreateElectricityAccountDto , @Req() req : any) {
    const userId = req.user.userId||req.user.sub || req.user.id
    return this.electricityAccountsService.create(userId,createElectricityAccountDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    const role = req.user.role;
    return this.electricityAccountsService.findAll(userId, role);
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId || req.user.sub || req.user.id;
    const role = req.user.role;
    return this.electricityAccountsService.findOne(+id, userId, role);
  }

  
  }


