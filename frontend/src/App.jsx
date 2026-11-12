import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import Ordenes from './pages/Ordenes';
import OrdenDetalle from './pages/OrdenDetalle';
import Reporte from './pages/Reporte';

function Privada({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Privada><Layout /></Privada>}>
        <Route path="/" element={<Navigate to="/ordenes" replace />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/ordenes" element={<Ordenes />} />
        <Route path="/ordenes/:id" element={<OrdenDetalle />} />
        <Route path="/reporte" element={<Reporte />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
