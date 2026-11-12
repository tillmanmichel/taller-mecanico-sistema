import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from '../entities/vehiculo.entity';
import { Cliente } from '../entities/cliente.entity';
import { VehiculosController } from './vehiculos.controller';
import { VehiculosService } from './vehiculos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo, Cliente])],
  controllers: [VehiculosController],
  providers: [VehiculosService],
})
export class VehiculosModule {}
