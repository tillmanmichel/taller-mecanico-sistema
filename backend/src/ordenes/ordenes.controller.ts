import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CambiarEstadoDto, CreateOrdenDto, UpdateOrdenDto } from './dto/orden.dto';
import { EstadoOrden } from '../entities/orden.entity';

@Controller('ordenes')
export class OrdenesController {
  constructor(private service: OrdenesService) {}

  @Get()
  findAll(@Query('estado') estado?: EstadoOrden, @Query('vehiculoId') vehiculoId?: string) {
    return this.service.findAll(estado, vehiculoId ? Number(vehiculoId) : undefined);
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  // El usuario que registra la orden se toma del token, no del cuerpo de la petición
  @Post() create(@Body() dto: CreateOrdenDto, @Req() req: any) { return this.service.create(dto, req.user.sub); }

  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrdenDto) { return this.service.update(id, dto); }
  @Patch(':id/estado') cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: CambiarEstadoDto) {
    return this.service.cambiarEstado(id, dto);
  }
}
