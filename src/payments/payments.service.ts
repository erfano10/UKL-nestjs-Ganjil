import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { arrayUnique } from 'class-validator';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { SupabaseStorageService } from '../supabase-storage/supabase-storage.service.js';
import { extname } from 'path';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: SupabaseStorageService) { }

  checkingFile(file: Express.Multer.File) {
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      throw new BadRequestException(` Ukuran file maksimal 2 mb`)
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipe file tidak valid');
    }


  }

  async create(userId : number, createPaymentDto: CreatePaymentDto, file: Express.Multer.File) {
    const { billing_id } = createPaymentDto

    if (!file) {
      throw new BadRequestException('Bukti pembayaran wajib uploaded')
    }
    this.checkingFile(file)

    const billing = await this.prisma.billings.findUnique({
      where: { id: billing_id },
      include: {
        electricity_account: true,
        payments: true
      }
    })

    if (!billing) {
      throw new NotFoundException('Billing not found')
    }
    if (billing.status !== 'UNPAID') {
      throw new BadRequestException('This Billing already paid or waiting for verification')
    }
    const storagePath = `payments/${new Date().getTime()}-${extname(file.originalname)}`

    await this.storage.uploadFile(file, storagePath)

    const existingPayment = billing.payments[0]

    const result = await this.prisma.$transaction(async (prisma) => {
      let paymentRecord
      if (existingPayment) {
        if (existingPayment.payment_proof) {
          await this.storage.deleteFile(existingPayment.payment_proof).catch(() => null);
        }
        paymentRecord = await prisma.payments.update({
          where: { id: existingPayment.id }, // Aman karena existingPayment dipastikan ada
          data: {
            payment_proof: storagePath,
            status: 'PENDING',
            verified_by: null,
            verified_at: null,
          },
        })
      }else {
        // JALUR 2: Upload pertama kali (Belum ada data payment, JANGAN akses existingPayment.id di sini!)
        paymentRecord = await prisma.payments.create({
          data: {
            billing_id: billing_id,
            payment_proof: storagePath,
            status: 'PENDING',
          },
        });
      }



      paymentRecord = await this.prisma.billings.update({
        where: { id: billing_id },
        data: { status: 'WAITING_VERIFICATION' },
      });

      return paymentRecord;
    })
    return {
      message: 'Bukti pembayaran berhasil diunggah, menunggu verifikasi admin',
      data: result
    }
  }

  async findAll() {
    const payments = await this.prisma.payments.findMany({
      include: {
        billings: {
          include: {
            electricity_account: true,
          },
        },
        verifier: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      message: 'Daftar pembayaran berhasil diambil',
      data: payments,
    };
  }

  async findOne(id: number) {
    const payment = await this.prisma.payments.findUnique({
      where: { id },
      include: {
        billings: {
          include: {
            electricity_account: true,
          },
        },
        verifier: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Data pembayaran tidak ditemukan');
    }

    return {
      message: 'Detail pembayaran berhasil diambil',
      data: payment,
    };
  }




  async update(id: number, adminId: number, status: 'APPROVE' | 'REJECT') {
    const payment = await this.prisma.payments.findFirst({
      where: { id },
      include: { billings: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    const paymentStatus = status === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const billingStatus = status === 'APPROVE' ? 'PAID' : 'UNPAID';
    /** $transaction : fungsinya agar hasil konsisten  */
    const result = await this.prisma.$transaction(async (prisma) => {

      const updatedPayment = await prisma.payments.update({
        where: { id },
        data: {
          status: paymentStatus as any,
          verified_by: adminId,
          verified_at: new Date(),
        },
      });

      await prisma.billings.update({
        where: { id: payment.billing_id },
        data: {
          status: billingStatus as any
        },
      });

      return updatedPayment;
    });

    return {
      message: `Pembayaran berhasil di-${status}`,
      data: result,
    };
  }
}



