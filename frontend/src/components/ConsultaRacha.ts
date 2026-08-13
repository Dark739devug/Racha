import { ApiError, obtenerRachas, UsuarioRacha } from '../services/api';

interface ConsultaRachaOptions {
  onVolver: () => void;
}

function escapar(texto: string): string {
  const elemento = document.createElement('span');
  elemento.textContent = texto;
  return elemento.innerHTML;
}

function formatearFecha(fechaISO: string | null): string {
  if (!fechaISO) return 'Sin registro';
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia)).toLocaleDateString('es-GT', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}

function crearFila(datos: UsuarioRacha, posicion: number): string {
  return `
    <article class="fila-usuario">
      <span class="posicion">${posicion}</span>
      <div class="datos-usuario">
        <strong>${escapar(datos.nombre_usuario)}</strong>
        <small>Último inicio: ${formatearFecha(datos.ultimo_login)}</small>
      </div>
      <div class="dato-racha"><span>🔥</span><strong>${datos.racha_actual}</strong><small>Actual</small></div>
      <div class="dato-racha"><span>🏆</span><strong>${datos.racha_maxima}</strong><small>Máxima</small></div>
    </article>`;
}

export async function renderConsultaRacha(
  contenedor: HTMLElement,
  opciones: ConsultaRachaOptions,
): Promise<void> {
  contenedor.innerHTML = `
    <div class="panel-rachas">
      <div class="cabecera-rachas">
        <button type="button" class="boton-volver" id="btn-volver">← Volver</button>
        <button type="button" class="boton-actualizar" id="btn-actualizar">Actualizar</button>
      </div>
      <h1>Rachas de usuarios</h1>
      <p class="descripcion-consulta">Clasificación por racha actual</p>
      <p class="estado-lista" id="estado-lista">Cargando usuarios...</p>
      <div class="lista-usuarios" id="lista-usuarios"></div>
    </div>`;

  contenedor.querySelector<HTMLButtonElement>('#btn-volver')!
    .addEventListener('click', opciones.onVolver);
  const actualizar = contenedor.querySelector<HTMLButtonElement>('#btn-actualizar')!;

  const cargar = async (): Promise<void> => {
    const estado = contenedor.querySelector<HTMLParagraphElement>('#estado-lista')!;
    const lista = contenedor.querySelector<HTMLDivElement>('#lista-usuarios')!;
    actualizar.disabled = true;
    estado.textContent = 'Cargando usuarios...';
    lista.innerHTML = '';
    try {
      const usuarios = await obtenerRachas();
      estado.textContent = usuarios.length ? '' : 'Todavía no hay usuarios para mostrar.';
      lista.innerHTML = usuarios.map((usuario, indice) => crearFila(usuario, indice + 1)).join('');
    } catch (error) {
      estado.textContent = error instanceof ApiError
        ? error.message
        : 'No se pudo conectar con el servidor';
    } finally {
      actualizar.disabled = false;
    }
  };

  actualizar.addEventListener('click', cargar);
  await cargar();
}
