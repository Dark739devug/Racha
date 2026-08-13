import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async buscarPorUsuario(usuario: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { usuario } });
  }

  async buscarPorId(idUsuario: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async listarActivos(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: { activo: true },
      order: { rachaActual: 'DESC', rachaMaxima: 'DESC', nombreUsuario: 'ASC' },
    });
  }

  async crear(dto: CreateUsuarioDto): Promise<Usuario> {
    const existente = await this.buscarPorUsuario(dto.usuario);
    if (existente) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const passwordHasheado = await bcrypt.hash(dto.password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      usuario: dto.usuario,
      password: passwordHasheado,
      nombreUsuario: dto.nombreUsuario,
      rachaActual: 0,
      rachaMaxima: 0,
      ultimoLogin: null,
      activo: true,
    });

    return this.usuarioRepository.save(nuevoUsuario);
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    return this.usuarioRepository.save(usuario);
  }

  /**
   * Devuelve el usuario sin exponer la contraseña, listo para
   * enviarse en una respuesta HTTP.
   */
  mapearRespuestaPublica(usuario: Usuario) {
    return {
      id_usuario: usuario.idUsuario,
      usuario: usuario.usuario,
      nombre_usuario: usuario.nombreUsuario,
      racha_actual: usuario.rachaActual,
      racha_maxima: usuario.rachaMaxima,
      ultimo_login: usuario.ultimoLogin,
    };
  }
}
