<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



# Instalacion y configuracion manual

Este repositorio contiene un proyecto NestJS que incluye configuración para variables de entorno, conexión con una base de datos MySQL, y la creación de un módulo completo para manejar libros. Sigue las instrucciones a continuación para configurar y ejecutar el proyecto.

1) Instalación de Módulos

```bash
$ npm install class-validator class-transformer --save
$ npm install @nestjs/config --save-dev
$ npm install @nestjs/typeorm typeorm mysql2
$ npm install @nestjs/jwt passport passport-jwt
$ npm install --save-dev @types/moment-timezone

```
1. copear las carpetas `src/config`   , `src/common` y `src/modules/auth`
2. configurar las varaibles de entorno .env


3. importar en app.modules.ts
   
```typescript
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

```
4. configurar en main.ts

```typescript
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

```
5. Creación de Módulos   
<p> Para agregar un nuevo módulo a tu aplicación, como un módulo para manejar libros, utiliza el siguiente comando CLI de NestJS: (rest api/yes)</p>
<p>ejemplo:</p>
  
```bash
nest g resource modules/libros --no-spec
```

6. proteger las rutas:
<b>Proteger todo el modulo:</b>
<p>este va debajo de @Controller()</p>

```bash
@Controller('libros')
@Auth(UserRole.CLIENT,UserRole.ADMIN)
```


<b>Proteger una sola peticion:</b>

```bash
@Auth(UserRole.CLIENT,UserRole.ADMIN)
@Get()
  mifuncion() {
    return 'hola';
  }
```

# Instalacion directa

## Correr la app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



