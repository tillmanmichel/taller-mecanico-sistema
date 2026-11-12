import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoOrden, Orden } from '../entities/orden.entity';
import { Vehiculo } from '../entities/vehiculo.entity';
import { Usuario } from '../entities/usuario.entity';
import { CambiarEstadoDto, CreateOrdenDto, UpdateOrdenDto } from './dto/orden.dto';

// Regla de negocio: a qué estados se puede pasar desde cada estado
export const TRANSICIONES: Record<EstadoOrden, EstadoOrden[]> = {
  [EstadoOrden.COTIZADA]: [EstadoOrden.EN_PROCESO, EstadoOrden.CANCELADA],
  [EstadoOrden.EN_PROCESO]: [EstadoOrden.TERMINADA, EstadoOrden.CANCELADA],
  [EstadoOrden.TERMINADA]: [EstadoOrden.ENTREGADA],
  [EstadoOrden.ENTREGADA]: [],
  [EstadoOrden.CANCELADA]: [],
};

const fmt = (n: number) => n.toFixed(2);

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden) private repo: Repository<Orden>,
    @InjectRepository(Vehiculo) private vehiculos: Repository<Vehiculo>,
  ) {}

  findAll(estado?: EstadoOrden, vehiculoId?: number) {
    return this.repo.find({
      where: { ...(estado && { estado }), ...(vehiculoId && { vehiculo: { id: vehiculoId } }) },
      relations: { vehiculo: { cliente: true }, usuario: true },
      order: { fechaIngreso: 'DESC' },
    });
  }

  async findOne(id: number) {
    const orden = await this.repo.findOne({ where: { id }, relations: { vehiculo: { cliente: true }, usuario: true } });
    if (!orden) throw new NotFoundException(`Orden ${id} no encontrada`);
    return orden;
  }

  async create(dto: CreateOrdenDto, usuarioId: number) {
    const vehiculo = await this.vehiculos.findOneBy({ id: dto.vehiculoId });
    if (!vehiculo) throw new NotFoundException(`Vehículo ${dto.vehiculoId} no encontrado`);
    const orden = this.repo.create({
      vehiculo,
      usuario: { id: usuarioId } as Usuario,
      descripcionFalla: dto.descripcionFalla,
      diagnostico: dto.diagnostico ?? null,
      costoEstimado: fmt(dto.costoEstimado),
      estado: EstadoOrden.COTIZADA,
    });
    const { id } = await this.repo.save(orden);
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateOrdenDto) {
    const orden = await this.findOne(id);
    if (orden.estado === EstadoOrden.ENTREGADA || orden.estado === EstadoOrden.CANCELADA) {
      throw new BadRequestException(`Una orden ${orden.estado} ya no se puede modificar`);
    }
    if (dto.costoEstimado !== undefined && orden.estado !== EstadoOrden.COTIZADA) {
      throw new BadRequestException('La cotización solo se puede cambiar mientras la orden está cotizada');
    }
    if (dto.descripcionFalla !== undefined) orden.descripcionFalla = dto.descripcionFalla;
    if (dto.diagnostico !== undefined) orden.diagnostico = dto.diagnostico;
    if (dto.detalleRefacciones !== undefined) orden.detalleRefacciones = dto.detalleRefacciones;
    if (dto.costoEstimado !== undefined) orden.costoEstimado = fmt(dto.costoEstimado);
    if (dto.costoRefacciones !== undefined) orden.costoRefacciones = fmt(dto.costoRefacciones);
    await this.repo.save(orden);
    return this.findOne(id);
  }

  async cambiarEstado(id: number, dto: CambiarEstadoDto) {
    const orden = await this.findOne(id);
    const permitidos = TRANSICIONES[orden.estado];
    if (!permitidos.includes(dto.estado)) {
      throw new BadRequestException(
        `No se puede pasar de "${orden.estado}" a "${dto.estado}". Permitidos: ${permitidos.join(', ') || 'ninguno'}`,
      );
    }
    if (dto.estado === EstadoOrden.ENTREGADA) {
      if (dto.totalFinal === undefined) throw new BadRequestException('Indica el total cobrado para entregar la orden');
      orden.totalFinal = fmt(dto.totalFinal);
      orden.fechaEntrega = new Date();
    }
    orden.estado = dto.estado;
    await this.repo.save(orden);
    return this.findOne(id);
  }
}
