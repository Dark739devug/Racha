import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryFailedError } from 'typeorm';
import { HistorialLogin } from './entities/historial-login.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { FechaUtil } from '../common/utils/fecha.util';

@Injectable()
export class RachaService {
  private readonly logger = new Logger(RachaService.name);

  constructor(
    @InjectRepository(HistorialLogin)
    private readonly historialRepository: Repository<HistorialLogin>,
  ) {}

 
  calcularNuevaRacha(usuario: Usuario): { usuario: Usuario; yaHabiaLoginHoy: boolean } {
    const hoy = FechaUtil.hoy();
    const ayer = FechaUtil.diaAnterior(hoy);
    const ultimoLogin = FechaUtil.normalizar(usuario.ultimoLogin);

    let yaHabiaLoginHoy = false;

    if (ultimoLogin === null) {
      // Primer inicio de sesión del usuario
      usuario.rachaActual = 1;
    } else if (FechaUtil.sonIguales(ultimoLogin, hoy)) {
      // Ya inició sesión hoy: la racha NO se toca
      yaHabiaLoginHoy = true;
    } else if (FechaUtil.sonIguales(ultimoLogin, ayer)) {
      // Continuó la racha desde el día calendario anterior
      usuario.rachaActual = usuario.rachaActual + 1;
    } else {
      // Se saltó al menos un día -> la racha se reinicia
      usuario.rachaActual = 1;
    }

    if (usuario.rachaActual > usuario.rachaMaxima) {
      usuario.rachaMaxima = usuario.rachaActual;
    }

    usuario.ultimoLogin = hoy;

    return { usuario, yaHabiaLoginHoy };
  }

  /**
   * Registra el login de hoy en historial_login. Gracias a la
   * restricción UNIQUE(id_usuario, fecha_login), si ya existía un
   * registro para hoy, esta inserción simplemente no duplica nada:
   * capturamos el error de duplicado y lo ignoramos silenciosamente,
   * como defensa adicional ante logins concurrentes el mismo día.
   */
  async registrarLoginDeHoy(idUsuario: number): Promise<void> {
    const hoy = FechaUtil.hoy();
    try {
      await this.historialRepository.insert({
        idUsuario,
        fechaLogin: hoy,
      });
    } catch (error) {
      if (this.esErrorDeDuplicado(error)) {
        this.logger.debug(
          `Login duplicado para el mismo día (usuario ${idUsuario}, fecha ${hoy}), se ignora.`,
        );
        return;
      }
      throw error;
    }
  }

  private esErrorDeDuplicado(error: unknown): boolean {
    // Código de error de PostgreSQL para violación de UNIQUE constraint
    return (
      error instanceof QueryFailedError &&
      (error as any).code === '23505'
    );
  }

  mapearEstadoRacha(usuario: Usuario) {
    return {
      id_usuario: usuario.idUsuario,
      nombre_usuario: usuario.nombreUsuario,
      racha_actual: usuario.rachaActual,
      racha_maxima: usuario.rachaMaxima,
      ultimo_login: usuario.ultimoLogin,
    };
  }
}
