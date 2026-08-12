import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialLogin } from './entities/historial-login.entity';
import { RachaService } from './racha.service';

// Nota: el endpoint GET /usuarios/:id/racha vive en UsuarioController
// (sección 8 del enunciado dice "o una ruta equivalente"), por eso
// este módulo no expone su propio controller: solo el servicio,
// que es consumido por UsuarioModule y AuthModule.
@Module({
  imports: [TypeOrmModule.forFeature([HistorialLogin])],
  providers: [RachaService],
  exports: [RachaService],
})
export class RachaModule {}
