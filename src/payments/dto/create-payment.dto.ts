import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    billing_id!: number;

    
}
