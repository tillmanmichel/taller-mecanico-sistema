import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Vehiculo } from '../entities/vehiculo.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateVehiculoDto, UpdateVehiculoDto } from './dto/vehiculo.dto';
import { manejarErrorBD } from '../common/db-errors';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo) private repo: Repository<Vehiculo>,
    @InjectRepository(Cliente) private clientes: Repository<Cliente>,
  ) {}

  findAll(q?: string, clienteId?: number) {
    const base = clienteId ? { cliente: { id: clienteId } } : {};
    const where = q
      ? [{ ...base, placas: ILike(`%${q}%`) }, { ...base, marca: ILike(`%${q}%`) }, { ...base, modelo: ILike(`%${q}%`) }]
      : base;
    return this.repo.find({ where, relations: { cliente: true }, order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const v = await this.repo.findOne({
      where: { id },
      relations: { cliente: true, ordenes: true },
      order: { ordenes: { fechaIngreso: 'DESC' } },
    });
    if (!v) throw new NotFoundException(`Vehículo ${id} no encontrado`);
    return v;
  }

  private async buscarCliente(id: number) {
    const c = await this.clientes.findOneBy({ id });
    if (!c) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return c;
  }

  async create(dto: CreateVehiculoDto) {
    const { clienteId, ...datos } = dto;
    const vehiculo = this.repo.create({ ...datos, placas: datos.placas.toUpperCase().trim(), cliente: await this.buscarCliente(clienteId) });
    try {
      return await this.repo.save(vehiculo);
    } catch (e) {
      manejarErrorBD(e, 'Ya existe un vehículo con esas placas');
    }
  }

  async update(id: number, dto: UpdateVehiculoDto) {
    const vehiculo = await this.findOne(id);
    const { clienteId, ...datos } = dto;
    Object.assign(vehiculo, datos);
    if (datos.placas) vehiculo.placas = datos.placas.toUpperCase().trim();
    if (clienteId) vehiculo.cliente = await this.buscarCliente(clienteId);
    delete (vehiculo as any).ordenes; // evita que TypeORM intente re-guardar las órdenes
    try {
      return await this.repo.save(vehiculo);
    } catch (e) {
      manejarErrorBD(e, 'Ya existe un vehículo con esas placas');
    }
  }

  async remove(id: number) {
    const vehiculo = await this.findOne(id);
    if (vehiculo.ordenes.length > 0) {
      manejarErrorBD({ code: '23503' }, '', 'No se puede eliminar: el vehículo tiene órdenes registradas');
    }
    await this.repo.delete(id);
    return { eliminado: true };
  }
}
