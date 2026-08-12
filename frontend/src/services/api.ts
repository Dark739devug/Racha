// TODA la comunicación con el backend pasa por aquí.
// Nunca se escribe "localhost:3000" en los componentes: siempre se
// usa la variable de entorno VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL;

export interface UsuarioRacha {
  id_usuario: number;
  usuario?: string;
  nombre_usuario: string;
  racha_actual: number;
  racha_maxima: number;
  ultimo_login: string | null;
}

interface LoginResponse {
  message: string;
  usuario: UsuarioRacha;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function manejarRespuesta<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message || 'Ocurrió un error');
  }
  return data as T;
}

export async function login(usuario: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  });
  return manejarRespuesta<LoginResponse>(res);
}

export async function obtenerRacha(idUsuario: number): Promise<UsuarioRacha> {
  const res = await fetch(`${API_URL}/usuarios/${idUsuario}/racha`);
  return manejarRespuesta<UsuarioRacha>(res);
}
