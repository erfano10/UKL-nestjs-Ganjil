import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBillingDto {

    @IsNumber()
    @IsNotEmpty()
    electricity_account_id: number;

    @IsNumber()
    @IsNotEmpty()

    period_month: number;

    @IsNumber()
    @IsNotEmpty()
    period_year: number;

    @IsNumber()
    @IsNotEmpty()
    previous_meter: number;

    @IsNumber()
    @IsNotEmpty()
    current_meter: number;

    @IsDateString()
    @IsNotEmpty()
    due_date: string
}
