import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '@prisma/client'; // Sesuaikan dengan enum Prisma-mu

export class VerifyPaymentDto {
    @IsEnum(PaymentStatus)
    @IsNotEmpty()
    status: PaymentStatus
}