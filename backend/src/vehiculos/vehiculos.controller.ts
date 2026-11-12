import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto, UpdateVehiculoDto } from './dto/vehiculo.dto';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private service: VehiculosService) {}

  @Get()
  findAll(@Query('q') q?: string, @Query('clienteId') clienteId?: string) {
    return this.service.findAll(q, clienteId ? Number(clienteId) : undefined);
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateVehiculoDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehiculoDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
