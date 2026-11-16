
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateElectricityAccountDto {
    @IsNumber()
    @IsNotEmpty()
    
    electricity_service_id!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    customer_number!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    costumer_name!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;
}
