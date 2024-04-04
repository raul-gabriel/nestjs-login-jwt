import { Module, Global } from '@nestjs/common';
import { JwtConfigService } from './constants/config_jwt'; // Asegúrate de que la ruta sea correcta

@Global()
@Module({
    providers: [JwtConfigService], // Proporciona JwtConfigService en este módulo
    exports: [JwtConfigService], // Exporta JwtConfigService para que otros módulos puedan usarlo
})
export class ConfigModule { }
