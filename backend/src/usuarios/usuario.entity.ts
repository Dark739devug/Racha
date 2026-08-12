import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { HistorialLogin } from '../rachas/entities/historial-login.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  usuario: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'nombre_usuario', type: 'varchar', length: 150 })
  nombreUsuario: string;

  @Column({ name: 'racha_actual', type: 'int', default: 0 })
  rachaActual: number;

  @Column({ name: 'racha_maxima', type: 'int', default: 0 })
  rachaMaxima: number;

  // Se guarda y se lee como string 'YYYY-MM-DD' (ver FechaUtil)
  @Column({ name: 'ultimo_login', type: 'date', nullable: true })
  ultimoLogin: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @OneToMany(() => HistorialLogin, (historial) => historial.usuario)
  historialLogins: HistorialLogin[];
}
