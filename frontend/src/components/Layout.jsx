import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const MENU = [
  { to: '/ordenes', texto: 'Órdenes de servicio' },
  { to: '/clientes', texto: 'Clientes' },
  { to: '/vehiculos', texto: 'Vehículos' },
  { to: '/reporte', texto: 'Reporte de órdenes' },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="d-flex">
      <aside className="sidebar p-3 no-imprimir d-flex flex-column">
        <h5 className="text-white mb-4">🔧 Taller Mecánico</h5>
        <nav className="nav flex-column gap-1">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} className="nav-link">{m.texto}</NavLink>
          ))}
        </nav>
        <div className="mt-auto text-white-50 small">
          <div className="mb-2">{usuario?.nombre}</div>
          <button className="btn btn-sm btn-outline-light w-100" onClick={() => { logout(); navigate('/login'); }}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
