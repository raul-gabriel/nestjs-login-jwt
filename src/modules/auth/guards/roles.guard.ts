import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../../common/enums/roles.enum';
import { JwtConfigService } from '../constants/config_jwt';
//import { jwtConfig } from '../constants/config_jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService,private JwtConfigService:JwtConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Recuperar los roles asignados
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si no se requieren roles específicos o el array está vacío, permitir acceso (público)
    }


    // Recuperar el token del encabezado de autorización
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Extraer el token de manera más clara

    //recuperamos el token
    let payload
    const { claveJwt } = this.JwtConfigService.getJwtConfig();
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: claveJwt,
      });
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
    

    // Convertir los roles del usuario a UserRole
    let userRoles: UserRole[] = [];
    if (Array.isArray(payload.roles)) {
      userRoles = payload.roles;
    } else if (typeof payload.roles === 'string') {
      userRoles = [payload.roles as UserRole];
    } else {
      throw new UnauthorizedException('Los roles del usuario no están en el formato esperado');
    }

    // Comprobar si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = requiredRoles.some(requiredRole => userRoles.includes(requiredRole));

    if (!hasRequiredRole) {
      throw new UnauthorizedException('No tienes permiso para acceder a este recurso'); // Lanzar si falta un rol requerido
    }

    return true; // Permitir acceso si todas las comprobaciones son exitosas
  }
}
