// Cliente HTTP: agrega el token JWT a cada petición y convierte errores del backend en mensajes legibles
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function api(ruta, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  let res;
  try {
    res = await fetch(BASE + ruta, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
  }

  if (res.status === 401 && ruta !== '/auth/login') {
    localStorage.clear();
    window.location.href = '/login'; // sesión expirada
    return;
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join('. ') : data?.message;
    throw new Error(msg || `Error ${res.status}`);
  }
  return data;
}
