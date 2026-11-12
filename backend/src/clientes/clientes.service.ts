import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';
import { manejarErrorBD } from '../common/db-errors';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private repo: Repository<Cliente>) {}

  findAll(q?: string) {
    const where = q ? [{ nombre: ILike(`%${q}%`) }, { telefono: ILike(`%${q}%`) }] : undefined;
    return this.repo.find({ where, relations: { vehiculos: true }, order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const cliente = await this.repo.findOne({ where: { id }, relations: { vehiculos: true } });
    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  create(dto: CreateClienteDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, dto);
    return this.repo.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    try {
      await this.repo.remove(cliente);
    } catch (e) {
      manejarErrorBD(e, '', 'No se puede eliminar: el cliente tiene vehículos registrados');
    }
    return { eliminado: true };
  }
}
