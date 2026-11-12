import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Orden } from './orden.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => Cliente, (c) => c.vehiculos, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cliente_id' }) cliente!: Cliente;
  @Column({ length: 50 }) marca!: string;
  @Column({ length: 50 }) modelo!: string;
  @Column({ type: 'int' }) anio!: number;
  @Column({ length: 15, unique: true }) placas!: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) color!: string | null;
  @CreateDateColumn({ name: 'creado_en' }) creadoEn!: Date;
  @OneToMany(() => Orden, (o) => o.vehiculo) ordenes!: Orden[];
}
