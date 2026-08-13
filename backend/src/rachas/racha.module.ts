import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialLogin } from './entities/historial-login.entity';
import { RachaService } from './racha.service';


@Module({
  imports: [TypeOrmModule.forFeature([HistorialLogin])],
  providers: [RachaService],
  exports: [RachaService],
})
export class RachaModule {}
