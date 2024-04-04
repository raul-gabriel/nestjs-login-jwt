import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CodificadorService } from '../../common/codificador.service'
import { JwtConfigService } from './constants/config_jwt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    @InjectEntityManager() private entityManager: EntityManager,
    private Codificador: CodificadorService,
    private JwtConfigService:JwtConfigService) {
      
     }


  //datos usuario prueba
  /*private readonly users: LoginDTO[] = [
    { username: 'admin', password: 'admin', roles: [UserRole.ADMIN] },
    { username: 'user', password: 'user', roles: [UserRole.USER] },
    { username: 'client', password: 'client', roles: [UserRole.CLIENT] },
  ];*/

  //metodo validacion login
  async validateUser(loginDto: LoginDTO): Promise<any> {

    //busca si el usuario existe
    /*const user = this.users.find(u => u.username === loginDto.username && u.password === loginDto.password);
    return user || null;*/


    const Respuesta = await this.entityManager.query('CALL IniciarSesion(?,?)', [loginDto.username, loginDto.password]);

    if (Respuesta[0][0].codMensaje == '0') {
      return { codMensaje: Respuesta[0][0].codMensaje, mensaje: Respuesta[0][0].mensaje };
    }

    //devolver la consulta
    return { codMensaje: Respuesta[0][0].codMensaje, mensaje: Respuesta[0][0] };
  }

  //metodo iniciar
  async login(loginDto: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto);

    if (user.codMensaje == '0') {
      throw new UnauthorizedException(user.mensaje);
    }

    let datos = user.mensaje
    //console.log(datos)

    //construir el payload
    //const payload = { user: user.username, sub: user.username, roles: user.roles };
    //let payload=user.mensaje

    //con datos encriptado
    /*const payload = {
      name: datos.nombres, roles: datos.tipo_usuario,
      id_user: this.Codificador.cifrar(datos.id.toString()),
      access_role: this.Codificador.cifrar(datos.tipo_usuario)
    };*/

    const payload = {
      name: datos.nombres, roles: datos.tipo_usuario
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  
  async profile(token:string) {
    
    const { claveJwt } = this.JwtConfigService.getJwtConfig();
    let data = await this.jwtService.verifyAsync(token, {
      secret: claveJwt,
    });


    return data;
  }
}
