import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import Alerta from '../components/Alerta';
import EstadoBadge from '../components/EstadoBadge';
import { ESTADOS, SIGUIENTES, dinero, fecha } from '../utils';

export default function OrdenDetalle() {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);
  const [form, setForm] = useState({});
  const [totalFinal, setTotalFinal] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  function aplicar(o) {
    setOrden(o);
    setForm({
      descripcionFalla: o.descripcionFalla,
      diagnostico: o.diagnostico ?? '',
      costoEstimado: o.costoEstimado,
      costoRefacciones: o.costoRefacciones ?? '',
      detalleRefacciones: o.detalleRefacciones ?? '',
    });
    setTotalFinal(o.totalFinal ?? o.costoEstimado);
  }

  useEffect(() => { api(`/ordenes/${id}`).then(aplicar).catch((e) => setError(e.message)); }, [id]);

  if (!orden) return <Alerta error={error} />;

  const cerrada = orden.estado === 'entregada' || orden.estado === 'cancelada';
  const campo = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }), disabled: cerrada });

  async function guardar(e) {
    e.preventDefault();
    setError(''); setOk('');
    const body = {
      descripcionFalla: form.descripcionFalla,
      diagnostico: form.diagnostico,
      detalleRefacciones: form.detalleRefacciones,
      ...(form.costoRefacciones !== '' && { costoRefacciones: Number(form.costoRefacciones) }),
      ...(orden.estado === 'cotizada' && { costoEstimado: Number(form.costoEstimado) }),
    };
    try { aplicar(await api(`/ordenes/${id}`, { method: 'PATCH', body })); setOk('Cambios guardados'); }
    catch (err) { setError(err.message); }
  }

  async function cambiarEstado(nuevo) {
    setError(''); setOk('');
    if (nuevo === 'cancelada' && !confirm('¿Cancelar esta orden? No se podrá reabrir.')) return;
    const body = { estado: nuevo, ...(nuevo === 'entregada' && { totalFinal: Number(totalFinal) }) };
    try { aplicar(await api(`/ordenes/${id}/estado`, { method: 'PATCH', body })); setOk(`Orden marcada como ${ESTADOS[nuevo].texto.toLowerCase()}`); }
    catch (err) { setError(err.message); }
  }

  const utilidad = orden.totalFinal && orden.costoRefacciones ? Number(orden.totalFinal) - Number(orden.costoRefacciones) : null;
  const v = orden.vehiculo;

  return (
    <>
      <div className="no-imprimir">
        <Link to="/ordenes" className="small">← Volver a órdenes</Link>
        <div className="d-flex justify-content-between align-items-center my-2">
          <h3 className="mb-0">Orden #{orden.id} <EstadoBadge estado={orden.estado} /></h3>
          <button className="btn btn-outline-dark" onClick={() => window.print()}>🖨 Imprimir cotización</button>
        </div>
        <Alerta error={error} onClose={() => setError('')} />
        {ok && <div className="alert alert-success py-2">{ok}</div>}

        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card p-3 mb-3">
              <h6>Vehículo y cliente</h6>
              <div className="fw-semibold">{v.marca} {v.modelo} {v.anio} · {v.placas}</div>
              <div>{v.cliente.nombre}</div>
              <div className="text-muted small">{v.cliente.telefono} {v.cliente.email && `· ${v.cliente.email}`}</div>
              <hr />
              <div className="small">Ingreso: {fecha(orden.fechaIngreso)}</div>
              <div className="small">Entrega: {fecha(orden.fechaEntrega)}</div>
              <div className="small">Registró: {orden.usuario.nombre}</div>
            </div>

            <div className="card p-3">
              <h6>Cambiar estado</h6>
              {SIGUIENTES[orden.estado].length === 0 && <p className="text-muted small mb-0">La orden está cerrada.</p>}
              {SIGUIENTES[orden.estado].includes('entregada') && (
                <div className="mb-2">
                  <label className="form-label small">Total cobrado al cliente</label>
                  <input className="form-control" type="number" step="0.01" min="0" value={totalFinal} onChange={(e) => setTotalFinal(e.target.value)} />
                </div>
              )}
              <div className="d-flex flex-wrap gap-2">
                {SIGUIENTES[orden.estado].map((s) => (
                  <button key={s} className={`btn btn-${ESTADOS[s].color}`} onClick={() => cambiarEstado(s)}>
                    Pasar a {ESTADOS[s].texto.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <form className="card p-3" onSubmit={guardar}>
              <h6>Datos de la orden</h6>
              <label className="form-label small">Falla reportada</label>
              <textarea className="form-control mb-2" rows={2} required {...campo('descripcionFalla')} />
              <label className="form-label small">Diagnóstico del mecánico</label>
              <textarea className="form-control mb-2" rows={2} {...campo('diagnostico')} />
              <label className="form-label small">Cotización (costo estimado)</label>
              <input className="form-control mb-3" type="number" step="0.01" min="0" {...campo('costoEstimado')} disabled={orden.estado !== 'cotizada'} />

              <div className="border rounded p-2 mb-3 bg-light">
                <div className="small fw-semibold text-danger mb-2">Uso interno · no se imprime para el cliente</div>
                <div className="row g-2">
                  <div className="col-md-4">
                    <label className="form-label small">Costo de refacciones</label>
                    <input className="form-control" type="number" step="0.01" min="0" {...campo('costoRefacciones')} />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label small">Detalle de refacciones</label>
                    <input className="form-control" {...campo('detalleRefacciones')} />
                  </div>
                </div>
                {utilidad !== null && <div className="small mt-2">Utilidad de la orden: <b>{dinero(utilidad)}</b></div>}
              </div>

              {!cerrada && <button className="btn btn-primary align-self-start">Guardar cambios</button>}
              {orden.totalFinal && <div className="mt-2">Total cobrado: <b>{dinero(orden.totalFinal)}</b></div>}
            </form>
          </div>
        </div>
      </div>

      {/* Versión impresa para el cliente: sin costos internos */}
      <div className="solo-impresion">
        <h3>Taller Mecánico Automotriz</h3>
        <h5>Cotización – Orden #{orden.id}</h5>
        <p>Fecha: {fecha(orden.fechaIngreso)}</p>
        <p><b>Cliente:</b> {v.cliente.nombre} · {v.cliente.telefono}</p>
        <p><b>Vehículo:</b> {v.marca} {v.modelo} {v.anio} · Placas {v.placas}</p>
        <p><b>Falla reportada:</b> {orden.descripcionFalla}</p>
        {orden.diagnostico && <p><b>Diagnóstico:</b> {orden.diagnostico}</p>}
        <h4>Total estimado: {dinero(orden.costoEstimado)}</h4>
        <p className="mt-5">_____________________________<br />Firma de conformidad del cliente</p>
      </div>
    </>
  );
}
