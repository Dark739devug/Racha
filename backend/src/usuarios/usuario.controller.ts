import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { RachaService } from '../rachas/racha.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly rachaService: RachaService,
  ) {}

  /**
   * GET /usuarios/:id/racha
   * Devuelve el estado actual de la racha de un usuario, usado por
   * el frontend para pintar el dashboard (ej. al refrescar la página).
   */
  @Get(':id/racha')
  async obtenerRacha(@Param('id', ParseIntPipe) id: number) {
    const usuario = await this.usuarioService.buscarPorId(id);
    return this.rachaService.mapearEstadoRacha(usuario);
  }
}
