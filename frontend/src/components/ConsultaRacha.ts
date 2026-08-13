import { ApiError, obtenerRacha, UsuarioRacha } from '../services/api';

interface ConsultaRachaOptions {
  onVolver: () => void;
}

function formatearFecha(fechaISO: string | null): string {
  if (!fechaISO) return 'Sin registro';
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia)).toLocaleDateString('es-GT', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

function crearResultado(datos: UsuarioRacha): string {
  return `
    <section class="resultado-racha" aria-live="polite">
      <h2>${datos.nombre_usuario}</h2>
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
    </section>`;
}

export function renderConsultaRacha(contenedor: HTMLElement, opciones: ConsultaRachaOptions): void {
  contenedor.innerHTML = `
    <div class="tarjeta-login consulta-racha">
      <button type="button" class="boton-volver" id="btn-volver">← Volver al inicio</button>
      <h1>Consultar racha</h1>
      <p class="descripcion-consulta">Consulta tu progreso sin iniciar sesión.</p>
      <form id="form-consulta">
        <label for="id-usuario">ID de usuario</label>
        <input type="number" id="id-usuario" name="idUsuario" min="1" step="1"
          inputmode="numeric" placeholder="Ejemplo: 1" required />
        <button type="submit" id="btn-consultar">Ver mi racha</button>
        <p class="mensaje-error" id="mensaje-error" role="alert"></p>
      </form>
      <div id="resultado"></div>
    </div>`;

  const form = contenedor.querySelector<HTMLFormElement>('#form-consulta')!;
  const boton = contenedor.querySelector<HTMLButtonElement>('#btn-consultar')!;
  const mensajeError = contenedor.querySelector<HTMLParagraphElement>('#mensaje-error')!;
  const resultado = contenedor.querySelector<HTMLDivElement>('#resultado')!;

  contenedor.querySelector<HTMLButtonElement>('#btn-volver')!
    .addEventListener('click', opciones.onVolver);

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensajeError.textContent = '';
    resultado.innerHTML = '';
    const idUsuario = Number((form.elements.namedItem('idUsuario') as HTMLInputElement).value);
    boton.disabled = true;
    boton.textContent = 'Consultando...';

    try {
      resultado.innerHTML = crearResultado(await obtenerRacha(idUsuario));
    } catch (error) {
      mensajeError.textContent = error instanceof ApiError
        ? error.message
        : 'No se pudo conectar con el servidor';
    } finally {
      boton.disabled = false;
      boton.textContent = 'Ver mi racha';
    }
  });
}
