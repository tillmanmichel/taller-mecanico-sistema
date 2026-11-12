import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from '../entities/orden.entity';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orden])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
