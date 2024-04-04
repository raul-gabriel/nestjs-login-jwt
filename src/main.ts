import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as momentTimezone from 'moment-timezone';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuracion=app.get(ConfigService)
  const port = configuracion.get<number>('port');

  //zona horaria
  const zona= configuracion.get<string>('zonaHoraria');
  momentTimezone.tz.setDefault(zona);

  //validacion
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`Corriendo en el puerto: ${port}`);
}
bootstrap();

