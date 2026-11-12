import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @IsString() @IsNotEmpty({ message: 'El nombre es obligatorio' }) @MaxLength(150)
  nombre!: string;

  @Matches(/^[0-9 +()-]{7,20}$/, { message: 'Teléfono inválido' })
  telefono!: string;

  @IsOptional() @IsEmail({}, { message: 'Correo inválido' }) @MaxLength(150)
  email?: string | null;
}

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
