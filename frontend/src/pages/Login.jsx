import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import Alerta from '../components/Alerta';

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <form className="card p-4" style={{ width: 360 }} onSubmit={enviar}>
        <h4 className="mb-1">Taller Mecánico</h4>
        <p className="text-muted mb-4">Inicia sesión para continuar</p>
        <Alerta error={error} />
        <label className="form-label">Correo</label>
        <input className="form-control mb-3" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="form-label">Contraseña</label>
        <input className="form-control mb-4" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-100" disabled={cargando}>{cargando ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </div>
  );
}
