import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Alerta from '../components/Alerta';
import EstadoBadge from '../components/EstadoBadge';
import { ESTADOS, dinero, fecha } from '../utils';

const VACIO = { vehiculoId: '', descripcionFalla: '', costoEstimado: '' };

export default function Ordenes() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [estado, setEstado] = useState('');
  const [form, setForm] = useState(VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState('');

  const cargar = () => api(`/ordenes${estado ? `?estado=${estado}` : ''}`).then(setOrdenes).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, [estado]);
  useEffect(() => { api('/vehiculos').then(setVehiculos).catch((e) => setError(e.message)); }, []);

  async function crear(e) {
    e.preventDefault();
    setError('');
    try {
      const orden = await api('/ordenes', {
        method: 'POST',
        body: { vehiculoId: Number(form.vehiculoId), descripcionFalla: form.descripcionFalla, costoEstimado: Number(form.costoEstimado) },
      });
      navigate(`/ordenes/${orden.id}`);
    } catch (err) { setError(err.message); }
  }

  const campo = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Órdenes de servicio</h3>
        <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>{mostrarForm ? 'Cerrar' : '+ Nueva orden'}</button>
      </div>
      <Alerta error={error} onClose={() => setError('')} />

      {mostrarForm && (
        <form className="card p-3 mb-3" onSubmit={crear}>
          <h6>Nueva orden (se crea como cotización)</h6>
          <div className="row g-2">
            <div className="col-md-4">
              <select className="form-select" required {...campo('vehiculoId')}>
                <option value="">Vehículo *</option>
                {vehiculos.map((v) => <option key={v.id} value={v.id}>{v.placas} – {v.marca} {v.modelo} ({v.cliente.nombre})</option>)}
              </select>
            </div>
            <div className="col-md-5"><input className="form-control" placeholder="Falla reportada por el cliente *" required {...campo('descripcionFalla')} /></div>
            <div className="col-md-2"><input className="form-control" type="number" step="0.01" min="0" placeholder="Cotización $ *" required {...campo('costoEstimado')} /></div>
            <div className="col-md-1"><button className="btn btn-success w-100">Crear</button></div>
          </div>
        </form>
      )}

      <div className="card p-3">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <button className={`btn btn-sm ${estado === '' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setEstado('')}>Todas</button>
          {Object.entries(ESTADOS).map(([k, v]) => (
            <button key={k} className={`btn btn-sm ${estado === k ? `btn-${v.color}` : `btn-outline-${v.color}`}`} onClick={() => setEstado(k)}>{v.texto}</button>
          ))}
        </div>
        <table className="table table-hover align-middle mb-0">
          <thead><tr><th>Folio</th><th>Ingreso</th><th>Vehículo</th><th>Cliente</th><th>Falla</th><th>Cotización</th><th>Estado</th></tr></thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id} role="button" onClick={() => navigate(`/ordenes/${o.id}`)}>
                <td><Link to={`/ordenes/${o.id}`}>#{o.id}</Link></td>
                <td>{fecha(o.fechaIngreso)}</td>
                <td>{o.vehiculo.placas}</td>
                <td>{o.vehiculo.cliente.nombre}</td>
                <td className="text-truncate" style={{ maxWidth: 220 }}>{o.descripcionFalla}</td>
                <td>{dinero(o.costoEstimado)}</td>
                <td><EstadoBadge estado={o.estado} /></td>
              </tr>
            ))}
            {ordenes.length === 0 && <tr><td colSpan={7} className="text-center text-muted">Sin órdenes</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
