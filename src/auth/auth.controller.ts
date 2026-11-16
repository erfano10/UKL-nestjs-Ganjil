import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { registerDto } from './dto/register.dto.js';
import { loginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';


@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('auth/register')
    async register(@Body() registerDto: registerDto) {
        return this.authService.register(registerDto);
    }


    @Post('auth/login')
    async login(@Body() loginDto: loginDto) {
        return this.authService.login(loginDto);
    }



    @UseGuards(JwtAuthGuard)
    @Get('users/me')
    
    async getMyProfile(@Req() req : any ) {
        
        const userId =  req.user.userId || req.user.sub  || req.user.id
        return this.authService.getMyProfile(userId)
    }
}

