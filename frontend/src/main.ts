import './style.css';
import { renderLoginForm } from './components/LoginForm';
import { renderDashboard } from './components/Dashboard';
import { obtenerRacha, UsuarioRacha } from './services/api';

const app = document.querySelector<HTMLDivElement>('#app')!;
const CLAVE_SESION = 'id_usuario';

function mostrarDashboard(usuario: UsuarioRacha): void {
  sessionStorage.setItem(CLAVE_SESION, String(usuario.id_usuario));
  renderDashboard(app, usuario, {
    onCerrarSesion: () => {
      sessionStorage.removeItem(CLAVE_SESION);
      mostrarLogin();
    },
  });
}

function mostrarLogin(): void {
  renderLoginForm(app, {
    onLoginExitoso: (usuario) => mostrarDashboard(usuario),
  });
}

async function iniciar(): Promise<void> {
  const idGuardado = sessionStorage.getItem(CLAVE_SESION);

  if (idGuardado) {
    try {
      const datos = await obtenerRacha(Number(idGuardado));
      mostrarDashboard(datos);
      return;
    } catch {
      sessionStorage.removeItem(CLAVE_SESION);
    }
  }

  mostrarLogin();
}

iniciar();
