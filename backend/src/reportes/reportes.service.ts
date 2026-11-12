import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { EstadoOrden, Orden } from '../entities/orden.entity';

// Suma en centavos (enteros) para evitar errores de redondeo con decimales
const centavos = (v: string | null) => (v ? Math.round(Number(v) * 100) : 0);
const pesos = (c: number) => (c / 100).toFixed(2);

@Injectable()
export class ReportesService {
  constructor(@InjectRepository(Orden) private repo: Repository<Orden>) {}

  async ordenes(desde: string, hasta: string, estado?: EstadoOrden) {
    const ini = new Date(`${desde}T00:00:00`);
    const fin = new Date(`${hasta}T23:59:59.999`);
    if (isNaN(ini.getTime()) || isNaN(fin.getTime())) throw new BadRequestException('Fechas inválidas (usa AAAA-MM-DD)');
    if (ini > fin) throw new BadRequestException('"desde" no puede ser posterior a "hasta"');

    const ordenes = await this.repo.find({
      where: { fechaIngreso: Between(ini, fin), ...(estado && { estado }) },
      relations: { vehiculo: { cliente: true } },
      order: { fechaIngreso: 'ASC' },
    });

    const porEstado = Object.fromEntries(Object.values(EstadoOrden).map((e) => [e, 0])) as Record<EstadoOrden, number>;
    let cobrado = 0, refacciones = 0;
    for (const o of ordenes) {
      porEstado[o.estado]++;
      if (o.estado === EstadoOrden.ENTREGADA) {   // solo cuenta dinero de órdenes cobradas
        cobrado += centavos(o.totalFinal);
        refacciones += centavos(o.costoRefacciones);
      }
    }
    return {
      periodo: { desde, hasta },
      resumen: {
        totalOrdenes: ordenes.length,
        porEstado,
        totalCobrado: pesos(cobrado),
        costoRefacciones: pesos(refacciones),
        utilidad: pesos(cobrado - refacciones),
      },
      ordenes,
    };
  }
}
