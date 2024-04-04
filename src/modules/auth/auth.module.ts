// auth.module.ts
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { CodificadorService } from 'src/common/codificador.service';
import { ConfigModule } from './config.module'; // Asegúrate de que la ruta sea correcta
import { JwtConfigService } from './constants/config_jwt';
import { AuthController } from './auth.controller';

@Global()
@Module({
    imports: [
        ConfigModule, // Importa el módulo que contiene JwtConfigService
        JwtModule.registerAsync({
            imports: [ConfigModule], // Asegúrate de importar el módulo aquí también
            inject: [JwtConfigService],
            useFactory: async (jwtConfigService: JwtConfigService) => {
                const { claveJwt, expiracion } = jwtConfigService.getJwtConfig();
                return {
                    global: true,
                    secret: claveJwt,
                    signOptions: { expiresIn: expiracion },
                };
            },
        }),
        // otros módulos/importaciones aquí
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        RolesGuard,
        CodificadorService,
        // JwtConfigService ya no se necesita aquí porque se proporciona en ConfigModule
    ],
    exports: [
        JwtModule,
        AuthService,
        RolesGuard,
        CodificadorService,
        // JwtConfigService ya no se necesita aquí porque se exporta desde ConfigModule
    ],
})
export class AuthModule { }
