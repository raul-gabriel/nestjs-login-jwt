import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

//const configuracion=app.get(ConfigService)

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql', // o el tipo de base de datos que estés utilizando   +config.get('DB_PORT', 3306),
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password:config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Debería ser `false` en producción
      }),
    }),
  ],
})
export class DatabaseModule {}
