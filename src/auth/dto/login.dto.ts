import { IsNotEmpty, IsString, Min, MinLength } from "class-validator"

export class loginDto {
    @IsNotEmpty()
    @IsString()
    email!: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string
}