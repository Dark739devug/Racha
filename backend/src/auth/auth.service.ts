import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity';
import { HistorialLogin } from '../rachas/entities/historial-login.entity';
import { UsuarioService } from '../usuarios/usuario.service';
import { RachaService } from '../rachas/racha.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly usuarioService: UsuarioService,
    private readonly rachaService: RachaService,
    private readonly dataSource: DataSource,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario: dto.usuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    const passwordValido = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Toda la actualización de racha + registro de historial se hace
    // dentro de una transacción para que quede consistente aunque
    // falle a mitad de camino.
    const usuarioActualizado = await this.dataSource.transaction(
      async (manager) => {
        const { usuario: usuarioConRachaCalculada } =
          this.rachaService.calcularNuevaRacha(usuario);

        const guardado = await manager.save(Usuario, usuarioConRachaCalculada);

        await manager
          .getRepository(HistorialLogin)
          .createQueryBuilder()
          .insert()
          .values({
            idUsuario: guardado.idUsuario,
            // calcularNuevaRacha siempre establece ultimoLogin antes del save.
            fechaLogin: guardado.ultimoLogin!,
          })
          .orIgnore() // evita duplicados el mismo día (UNIQUE id_usuario+fecha_login)
          .execute();

        return guardado;
      },
    );

    return {
      message: 'Inicio de sesión exitoso',
      usuario: this.usuarioService.mapearRespuestaPublica(usuarioActualizado),
    };
  }
}
