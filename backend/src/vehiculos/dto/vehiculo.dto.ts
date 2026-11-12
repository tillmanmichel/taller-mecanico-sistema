import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateVehiculoDto {
  @IsInt({ message: 'Selecciona un cliente' }) clienteId!: number;
  @IsString() @IsNotEmpty({ message: 'La marca es obligatoria' }) @MaxLength(50) marca!: string;
  @IsString() @IsNotEmpty({ message: 'El modelo es obligatorio' }) @MaxLength(50) modelo!: string;
  @IsInt() @Min(1950) @Max(new Date().getFullYear() + 1) anio!: number;
  @IsString() @IsNotEmpty({ message: 'Las placas son obligatorias' }) @MaxLength(15) placas!: string;
  @IsOptional() @IsString() @MaxLength(30) color?: string | null;
}

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {}
