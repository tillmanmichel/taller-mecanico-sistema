export const dinero = (v) =>
  v === null || v === undefined || v === '' ? '—' : Number(v).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

export const fecha = (v) => (v ? new Date(v).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—');

export const ESTADOS = {
  cotizada: { texto: 'Cotizada', color: 'secondary' },
  en_proceso: { texto: 'En proceso', color: 'primary' },
  terminada: { texto: 'Terminada', color: 'info' },
  entregada: { texto: 'Entregada', color: 'success' },
  cancelada: { texto: 'Cancelada', color: 'danger' },
};

// Debe coincidir con TRANSICIONES del backend (ordenes.service.ts)
export const SIGUIENTES = {
  cotizada: ['en_proceso', 'cancelada'],
  en_proceso: ['terminada', 'cancelada'],
  terminada: ['entregada'],
  entregada: [],
  cancelada: [],
};

export const hoyISO = () => new Date().toLocaleDateString('en-CA'); // AAAA-MM-DD en hora local
