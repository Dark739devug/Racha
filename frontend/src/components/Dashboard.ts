import { UsuarioRacha } from '../services/api';

interface DashboardOptions {
  onCerrarSesion: () => void;
}

function formatearFecha(fechaISO: string | null): string {
  if (!fechaISO) return 'Sin registro';
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return fecha.toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// El frontend SOLO muestra los datos que ya vienen calculados por
// NestJS. No hay ninguna lógica de racha aquí.
export function renderDashboard(contenedor: HTMLElement, datos: UsuarioRacha, opciones: DashboardOptions): void {
  contenedor.innerHTML = `
    <div class="dashboard">
      <div class="encabezado">
        <h1>Bienvenido, ${datos.nombre_usuario}</h1>
        <button id="btn-logout">Cerrar sesión</button>
      </div>

      <div class="tarjetas">
        <div class="tarjeta tarjeta-actual">
          <span class="icono">🔥</span>
          <span class="etiqueta">Racha actual</span>
          <span class="valor">${datos.racha_actual} día${datos.racha_actual === 1 ? '' : 's'}</span>
        </div>

        <div class="tarjeta tarjeta-maxima">
          <span class="icono">🏆</span>
          <span class="etiqueta">Mejor racha</span>
          <span class="valor">${datos.racha_maxima} día${datos.racha_maxima === 1 ? '' : 's'}</span>
        </div>
      </div>

      <p class="ultimo-login">Último inicio: ${formatearFecha(datos.ultimo_login)}</p>
    </div>
  `;

  contenedor
    .querySelector<HTMLButtonElement>('#btn-logout')!
    .addEventListener('click', () => opciones.onCerrarSesion());
}
