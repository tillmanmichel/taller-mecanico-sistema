import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 150 }) nombre!: string;
  @Column({ length: 20 }) telefono!: string;
  @Column({ type: 'varchar', length: 150, nullable: true }) email!: string | null;
  @CreateDateColumn({ name: 'creado_en' }) creadoEn!: Date;
  @OneToMany(() => Vehiculo, (v) => v.cliente) vehiculos!: Vehiculo[];
}
