import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from '../entities/orden.entity';
import { Vehiculo } from '../entities/vehiculo.entity';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orden, Vehiculo])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
