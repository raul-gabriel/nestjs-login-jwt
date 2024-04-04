import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    //variables de entorno
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),

    //modulos
    DatabaseModule,//base de datos
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
