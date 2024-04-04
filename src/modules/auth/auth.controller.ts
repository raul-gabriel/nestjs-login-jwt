import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto'
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //inicar sesion
    @Post('login')
    async login(@Body() userDto: LoginDTO) {
        return this.authService.login(userDto);
    }

    //inicar sesion
    @Auth()
    @Get('getProfile')
    @Get('getProfile')
    async getProfile(@Req() req) {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1]; // Extraer el token de la cabecera Authorization
        const data = await this.authService.profile(token);
        return data;
    }
}