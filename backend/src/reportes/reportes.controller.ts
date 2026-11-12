import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { EstadoOrden } from '../entities/orden.entity';

@Controller('reportes')
export class ReportesController {
  constructor(private service: ReportesService) {}

  // GET /reportes/ordenes?desde=2026-11-01&hasta=2026-11-30&estado=entregada
  @Get('ordenes')
  ordenes(@Query('desde') desde: string, @Query('hasta') hasta: string, @Query('estado') estado?: EstadoOrden) {
    if (!desde || !hasta) throw new BadRequestException('Indica "desde" y "hasta"');
    return this.service.ordenes(desde, hasta, estado || undefined);
  }
}
