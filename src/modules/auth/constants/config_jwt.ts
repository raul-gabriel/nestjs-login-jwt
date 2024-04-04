// jwt-config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  getJwtConfig() {
    const claveJwt = this.configService.get<string>('CLAVE_JWT','963852741');
    const expiracion = this.configService.get<string>('EXPIRACION_JWT', '8h');
    return { claveJwt, expiracion };
  }
}
