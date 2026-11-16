import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"

export class CreateElectricityServiceDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    code!: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name!: string
    
    @IsNotEmpty()
    @IsNumber()
    power_va!: number

    @IsNotEmpty()
    @IsNumber()
    price_per_kwh!: number

    @IsNotEmpty()
    @IsBoolean()
    is_active: boolean

}
