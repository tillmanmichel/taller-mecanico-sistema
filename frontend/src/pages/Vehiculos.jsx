import { useEffect, useState } from 'react';
import { api } from '../api';
import Alerta from '../components/Alerta';

const VACIO = { clienteId: '', marca: '', modelo: '', anio: '', placas: '', color: '' };

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  const cargar = () => api(`/vehiculos${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setVehiculos).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, [q]);
  useEffect(() => { api('/clientes').then(setClientes).catch((e) => setError(e.message)); }, []);

  async function guardar(e) {
    e.preventDefault();
    setError('');
    const body = { ...form, clienteId: Number(form.clienteId), anio: Number(form.anio), color: form.color || null };
    try {
      if (editandoId) await api(`/vehiculos/${editandoId}`, { method: 'PATCH', body });
      else await api('/vehiculos', { method: 'POST', body });
      setForm(VACIO);
      setEditandoId(null);
      cargar();
    } catch (err) { setError(err.message); }
  }

  function editar(v) {
    setEditandoId(v.id);
    setForm({ clienteId: v.cliente.id, marca: v.marca, modelo: v.modelo, anio: v.anio, placas: v.placas, color: v.color ?? '' });
  }

  async function eliminar(v) {
    if (!confirm(`¿Eliminar el vehículo ${v.placas}?`)) return;
    try { await api(`/vehiculos/${v.id}`, { method: 'DELETE' }); cargar(); } catch (err) { setError(err.message); }
  }

  const campo = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <>
      <h3 className="mb-3">Vehículos</h3>
      <Alerta error={error} onClose={() => setError('')} />
      <div className="row g-3">
        <div className="col-lg-4">
          <form className="card p-3" onSubmit={guardar}>
            <h6>{editandoId ? 'Editar vehículo' : 'Nuevo vehículo'}</h6>
            <select className="form-select mb-2" required {...campo('clienteId')}>
              <option value="">Dueño (cliente) *</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <div className="row g-2 mb-2">
              <div className="col"><input className="form-control" placeholder="Marca *" required {...campo('marca')} /></div>
              <div className="col"><input className="form-control" placeholder="Modelo *" required {...campo('modelo')} /></div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col"><input className="form-control" type="number" placeholder="Año *" required {...campo('anio')} /></div>
              <div className="col"><input className="form-control" placeholder="Color" {...campo('color')} /></div>
            </div>
            <input className="form-control mb-3 text-uppercase" placeholder="Placas *" required {...campo('placas')} />
            <div className="d-flex gap-2">
              <button className="btn btn-primary">{editandoId ? 'Guardar cambios' : 'Registrar'}</button>
              {editandoId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditandoId(null); setForm(VACIO); }}>Cancelar</button>}
            </div>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="card p-3">
            <input className="form-control mb-3" placeholder="Buscar por placas, marca o modelo…" value={q} onChange={(e) => setQ(e.target.value)} />
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Placas</th><th>Vehículo</th><th>Año</th><th>Dueño</th><th></th></tr></thead>
              <tbody>
                {vehiculos.map((v) => (
                  <tr key={v.id}>
                    <td className="fw-semibold">{v.placas}</td>
                    <td>{v.marca} {v.modelo}{v.color && <span className="text-muted"> · {v.color}</span>}</td>
                    <td>{v.anio}</td><td>{v.cliente.nombre}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editar(v)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(v)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {vehiculos.length === 0 && <tr><td colSpan={5} className="text-center text-muted">Sin vehículos</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
