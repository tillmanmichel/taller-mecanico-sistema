import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { Usuario } from './usuario.entity';

export enum EstadoOrden {
  COTIZADA = 'cotizada',
  EN_PROCESO = 'en_proceso',
  TERMINADA = 'terminada',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada',
}

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => Vehiculo, (v) => v.ordenes, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehiculo_id' }) vehiculo!: Vehiculo;
  @ManyToOne(() => Usuario, (u) => u.ordenes, { nullable: false })
  @JoinColumn({ name: 'usuario_id' }) usuario!: Usuario;
  @Column({ name: 'descripcion_falla', type: 'text' }) descripcionFalla!: string;
  @Column({ type: 'text', nullable: true }) diagnostico!: string | null;
  @Column({ type: 'enum', enum: EstadoOrden, enumName: 'estado_orden', default: EstadoOrden.COTIZADA })
  estado!: EstadoOrden;
  // numeric llega como string desde pg para no perder precisión
  @Column({ name: 'costo_estimado', type: 'numeric', precision: 10, scale: 2 }) costoEstimado!: string;
  @Column({ name: 'total_final', type: 'numeric', precision: 10, scale: 2, nullable: true }) totalFinal!: string | null;
  // INTERNO: no se muestra al cliente en la cotización impresa
  @Column({ name: 'costo_refacciones', type: 'numeric', precision: 10, scale: 2, nullable: true }) costoRefacciones!: string | null;
  @Column({ name: 'detalle_refacciones', type: 'text', nullable: true }) detalleRefacciones!: string | null;
  @CreateDateColumn({ name: 'fecha_ingreso' }) fechaIngreso!: Date;
  @Column({ name: 'fecha_entrega', type: 'timestamp', nullable: true }) fechaEntrega!: Date | null;
}
