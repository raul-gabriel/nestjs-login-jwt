import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtConfigService } from '../constants/config_jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,private JwtConfigService:JwtConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    //verificar si ha iniciado sesion
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    //verificar el token
    const { claveJwt } = this.JwtConfigService.getJwtConfig();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: claveJwt
      });

      const currentTimestamp = Math.floor(Date.now() / 1000); // Obtener la marca de tiempo actual en segundos

      if (payload.exp && currentTimestamp > payload.exp) {
        throw new UnauthorizedException('El token ha expirado');
      }

      //request.user = payload;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  //extraer el token de la cabecera
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
