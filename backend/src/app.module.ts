import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuarios/usuario.module';
import { RachaModule } from './rachas/racha.module';
import { Usuario } from './usuarios/usuario.entity';
import { HistorialLogin } from './rachas/entities/historial-login.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sslRequerido = config.get<string>('DB_SSL_REQUIRED') === 'true';

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<string>('DB_PORT')) || 5432,
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          schema: config.get<string>('DB_SCHEMA') || 'public',
          // IMPORTANTE: DB_SYNCHRONIZE === 'true' (comparación estricta de
          // string), NUNCA Boolean(process.env...) porque Boolean('false')
          // da true (cualquier string no vacío es "truthy" en JS).
          synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
          logging: config.get<string>('DB_LOGGING') === 'true',
          entities: [Usuario, HistorialLogin],
          ssl: sslRequerido ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
    UsuarioModule,
    RachaModule,
  ],
})
export class AppModule {}
