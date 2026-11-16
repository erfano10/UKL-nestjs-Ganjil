import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BcryptService } from '../bcrypt/bcrypt.service.js';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto.js';
import { loginDto } from './dto/login.dto.js';
import { JwtPayload } from './types/jwt-payload.type.js';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly bcrypt: BcryptService,
        private readonly jwt: JwtService
    ) { }

    async register(registerDto: registerDto) {
        const { name, email, password } = registerDto

        const existingEmail = await this.prisma.users.findUnique({ where: { email } })

        if (existingEmail) {
            throw new ConflictException(`Email already Exist`)
        }

        const hashedPasword = await this.bcrypt.hash(password)

       const data =  await this.prisma.users.create({
            data: {
                name, email, password: hashedPasword
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
            }
        })
        return {
            message: `User has been registered`,
            data : data 

        }
    }

    async login(loginDto: loginDto) {

        const { email, password } = loginDto

        const selectedUser = await this.prisma.users.findFirst({ where: { email } })

        if (!selectedUser) {
            throw new UnauthorizedException('Invalid Credential')
        }
        /** proses pencocokan pasword(bcrypt) */
        const hashedPasword = selectedUser.password
        const isMatchPasword = await this.bcrypt.compare(password, hashedPasword)

        if (!isMatchPasword) {
            throw new UnauthorizedException(`Invalid Credential`)
        }

        /** persiapan payload untuk token */

        const payload: JwtPayload = {
            sub: selectedUser.id,
            email: selectedUser.email,
            role: selectedUser.role
        }

        /**generate token */
        const token = this.jwt.sign(payload)

        return {
            message: `User berhasil login `,
            data: {
                token,
                role: selectedUser.role
            }

        }
    }

    async getMyProfile(userId: number) {

        const user = await this.prisma.users.findFirst({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return {
            message: `Berhasil mengambil profil user`,
            data: user
        }
    }
}

