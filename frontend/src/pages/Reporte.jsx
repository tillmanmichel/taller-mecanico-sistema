import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Alerta from '../components/Alerta';
import EstadoBadge from '../components/EstadoBadge';
import { ESTADOS, dinero, fecha, hoyISO } from '../utils';

const inicioDeMes = () => hoyISO().slice(0, 8) + '01';

export default function Reporte() {
  const [desde, setDesde] = useState(inicioDeMes());
  const [hasta, setHasta] = useState(hoyISO());
  const [estado, setEstado] = useState('');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  async function generar(e) {
    e?.preventDefault();
    setError('');
    try { setDatos(await api(`/reportes/ordenes?desde=${desde}&hasta=${hasta}${estado ? `&estado=${estado}` : ''}`)); }
    catch (err) { setError(err.message); }
  }

  const r = datos?.resumen;
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Reporte de órdenes</h3>
        {datos && <button className="btn btn-outline-dark no-imprimir" onClick={() => window.print()}>🖨 Imprimir</button>}
      </div>
      <Alerta error={error} onClose={() => setError('')} />
      <form className="card p-3 mb-3 no-imprimir" onSubmit={generar}>
        <div className="row g-2 align-items-end">
          <div className="col-md-3"><label className="form-label small">Desde</label><input type="date" className="form-control" value={desde} onChange={(e) => setDesde(e.target.value)} required /></div>
          <div className="col-md-3"><label className="form-label small">Hasta</label><input type="date" className="form-control" value={hasta} onChange={(e) => setHasta(e.target.value)} required /></div>
          <div className="col-md-3">
            <label className="form-label small">Estado</label>
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.texto}</option>)}
            </select>
          </div>
          <div className="col-md-3"><button className="btn btn-primary w-100">Generar reporte</button></div>
        </div>
      </form>

      {r && (
        <>
          <p className="text-muted">Periodo: {datos.periodo.desde} a {datos.periodo.hasta}</p>
          <div className="row g-3 mb-3">
            {[['Órdenes', r.totalOrdenes], ['Total cobrado', dinero(r.totalCobrado)], ['Costo de refacciones', dinero(r.costoRefacciones)], ['Utilidad', dinero(r.utilidad)]].map(([t, v]) => (
              <div className="col-md-3" key={t}><div className="card p-3"><div className="text-muted small">{t}</div><div className="fs-4 fw-semibold">{v}</div></div></div>
            ))}
          </div>
          <div className="d-flex gap-3 mb-3 flex-wrap">
            {Object.entries(r.porEstado).map(([k, n]) => <span key={k}><EstadoBadge estado={k} /> {n}</span>)}
          </div>
          <p className="small text-muted">Los importes solo consideran órdenes entregadas (cobradas).</p>
          <div className="card p-3">
            <table className="table table-sm align-middle mb-0">
              <thead><tr><th>Folio</th><th>Ingreso</th><th>Vehículo</th><th>Cliente</th><th>Estado</th><th className="text-end">Cotización</th><th className="text-end">Cobrado</th><th className="text-end">Refacciones</th></tr></thead>
              <tbody>
                {datos.ordenes.map((o) => (
                  <tr key={o.id}>
                    <td><Link to={`/ordenes/${o.id}`}>#{o.id}</Link></td><td>{fecha(o.fechaIngreso)}</td>
                    <td>{o.vehiculo.placas}</td><td>{o.vehiculo.cliente.nombre}</td><td><EstadoBadge estado={o.estado} /></td>
                    <td className="text-end">{dinero(o.costoEstimado)}</td><td className="text-end">{dinero(o.totalFinal)}</td><td className="text-end">{dinero(o.costoRefacciones)}</td>
                  </tr>
                ))}
                {datos.ordenes.length === 0 && <tr><td colSpan={8} className="text-center text-muted">Sin órdenes en el periodo</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
