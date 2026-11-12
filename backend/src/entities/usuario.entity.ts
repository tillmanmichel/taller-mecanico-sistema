import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Orden } from './orden.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 150, unique: true }) email!: string;
  // select: false -> nunca se devuelve en las consultas normales
  @Column({ name: 'password_hash', length: 255, select: false }) passwordHash!: string;
  @CreateDateColumn({ name: 'creado_en' }) creadoEn!: Date;
  @OneToMany(() => Orden, (o) => o.usuario) ordenes!: Orden[];
}
