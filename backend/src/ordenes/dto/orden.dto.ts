import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EstadoOrden } from '../../entities/orden.entity';

const dinero = { maxDecimalPlaces: 2 };

export class CreateOrdenDto {
  @IsInt({ message: 'Selecciona un vehículo' }) vehiculoId!: number;
  @IsString() @IsNotEmpty({ message: 'Describe la falla' }) descripcionFalla!: string;
  @IsOptional() @IsString() diagnostico?: string;
  @IsNumber(dinero, { message: 'Costo estimado inválido' }) @Min(0) costoEstimado!: number;
}

// Edición de datos de la orden (no cambia el estado)
export class UpdateOrdenDto {
  @IsOptional() @IsString() @IsNotEmpty() descripcionFalla?: string;
  @IsOptional() @IsString() diagnostico?: string;
  @IsOptional() @IsNumber(dinero) @Min(0) costoEstimado?: number;
  @IsOptional() @IsNumber(dinero) @Min(0) costoRefacciones?: number;
  @IsOptional() @IsString() detalleRefacciones?: string;
}

export class CambiarEstadoDto {
  @IsEnum(EstadoOrden, { message: 'Estado inválido' }) estado!: EstadoOrden;
  // Obligatorio al pasar a "entregada"
  @IsOptional() @IsNumber(dinero) @Min(0) totalFinal?: number;
}
