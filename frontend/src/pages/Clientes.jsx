import { useEffect, useState } from 'react';
import { api } from '../api';
import Alerta from '../components/Alerta';

const VACIO = { nombre: '', telefono: '', email: '' };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  const cargar = () => api(`/clientes${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setClientes).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, [q]);

  async function guardar(e) {
    e.preventDefault();
    setError('');
    const body = { ...form, email: form.email || null };
    try {
      if (editandoId) await api(`/clientes/${editandoId}`, { method: 'PATCH', body });
      else await api('/clientes', { method: 'POST', body });
      setForm(VACIO);
      setEditandoId(null);
      cargar();
    } catch (err) { setError(err.message); }
  }

  function editar(c) {
    setEditandoId(c.id);
    setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email ?? '' });
  }

  async function eliminar(c) {
    if (!confirm(`¿Eliminar a ${c.nombre}?`)) return;
    try { await api(`/clientes/${c.id}`, { method: 'DELETE' }); cargar(); } catch (err) { setError(err.message); }
  }

  const campo = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <>
      <h3 className="mb-3">Clientes</h3>
      <Alerta error={error} onClose={() => setError('')} />
      <div className="row g-3">
        <div className="col-lg-4">
          <form className="card p-3" onSubmit={guardar}>
            <h6>{editandoId ? 'Editar cliente' : 'Nuevo cliente'}</h6>
            <input className="form-control mb-2" placeholder="Nombre *" required {...campo('nombre')} />
            <input className="form-control mb-2" placeholder="Teléfono *" required {...campo('telefono')} />
            <input className="form-control mb-3" type="email" placeholder="Correo (opcional)" {...campo('email')} />
            <div className="d-flex gap-2">
              <button className="btn btn-primary">{editandoId ? 'Guardar cambios' : 'Registrar'}</button>
              {editandoId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditandoId(null); setForm(VACIO); }}>Cancelar</button>}
            </div>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="card p-3">
            <input className="form-control mb-3" placeholder="Buscar por nombre o teléfono…" value={q} onChange={(e) => setQ(e.target.value)} />
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Nombre</th><th>Teléfono</th><th>Correo</th><th>Vehículos</th><th></th></tr></thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td><td>{c.telefono}</td><td>{c.email ?? '—'}</td><td>{c.vehiculos.length}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editar(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && <tr><td colSpan={5} className="text-center text-muted">Sin clientes</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
