import { ConflictException } from '@nestjs/common';

// Traduce errores de PostgreSQL a respuestas HTTP entendibles
export function manejarErrorBD(e: any, mensajeDuplicado: string, mensajeEnUso = 'El registro está en uso'): never {
  if (e?.code === '23505') throw new ConflictException(mensajeDuplicado); // unique_violation
  if (e?.code === '23503') throw new ConflictException(mensajeEnUso);     // foreign_key_violation
  throw e;
}
