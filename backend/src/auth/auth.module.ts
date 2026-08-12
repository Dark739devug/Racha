import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../usuarios/usuario.module';
import { RachaModule } from '../rachas/racha.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), UsuarioModule, RachaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
