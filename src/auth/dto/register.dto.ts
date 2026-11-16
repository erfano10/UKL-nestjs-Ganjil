import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator'

export class registerDto {
    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsEmail()
    email!: string
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string
}