import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BillingsService } from './billings.service.js';
import { CreateBillingDto } from './dto/create-billing.dto.js';


@Controller('billings')
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) { }

  @Post()
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingsService.create(createBillingDto);
  }

  @Get()
  findAll(@Req() req : any) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    const role = req.user?.role;
    return this.billingsService.findAll(userId, role);
    
  }

  
}
