import { ESTADOS } from '../utils';

export default function EstadoBadge({ estado }) {
  const e = ESTADOS[estado] ?? { texto: estado, color: 'dark' };
  return <span className={`badge text-bg-${e.color}`}>{e.texto}</span>;
}
