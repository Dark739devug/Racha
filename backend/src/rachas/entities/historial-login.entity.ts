import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Usuario } from '../../usuarios/usuario.entity';

@Entity('historial_login')
@Unique('uq_usuario_fecha', ['idUsuario', 'fechaLogin'])
export class HistorialLogin {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  idHistorial: number;

  @Column({ name: 'id_usuario', type: 'int' })
  idUsuario: number;

  // 'YYYY-MM-DD' (ver FechaUtil)
  @Column({ name: 'fecha_login', type: 'date' })
  fechaLogin: string;

  @CreateDateColumn({ name: 'hora_login' })
  horaLogin: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.historialLogins, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
