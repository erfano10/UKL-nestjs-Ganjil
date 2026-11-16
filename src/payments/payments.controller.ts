import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ForbiddenException, UploadedFile } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';


@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('payment_proof'))
  
  create(@Body() createPaymentDto: CreatePaymentDto, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    
    if (req.user?.role !== 'CUSTOMER') {
      throw new ForbiddenException('Hanya customer yang dapat mengunggah bukti pembayaran')
    }
    const userId = req.user?.userId || req.user?.sub || req.user?.id
    return this.paymentsService.create(userId, createPaymentDto, file);
  }

  @Get()
  findAll(@Req() req: any) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang dapat melihat daftar seluruh pembayaran');
    }

    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang dapat melihat detail pembayaran');
    }

    return this.paymentsService.findOne(id);
  }

  @Patch(':id/verify')
  update(@Param('id') id: number, @Body('status') status: 'APPROVE' | 'REJECT', @Req() req: any) {
    const adminId = req.user?.userId || req.user?.sub || req.user?.id
    return this.paymentsService.update(+id, adminId, status);
  }


}
