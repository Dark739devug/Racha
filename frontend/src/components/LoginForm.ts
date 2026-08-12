import { login, ApiError, UsuarioRacha } from '../services/api';

interface LoginFormOptions {
  onLoginExitoso: (usuario: UsuarioRacha) => void;
}

export function renderLoginForm(contenedor: HTMLElement, opciones: LoginFormOptions): void {
  contenedor.innerHTML = `
    <div class="tarjeta-login">
      <h1>Iniciar sesión</h1>
      <form id="form-login">
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" name="usuario" autocomplete="username" required />

        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" autocomplete="current-password" required />

        <button type="submit" id="btn-login">Iniciar sesión</button>
        <p class="mensaje-error" id="mensaje-error"></p>
      </form>
    </div>
  `;

  const form = contenedor.querySelector<HTMLFormElement>('#form-login')!;
  const mensajeError = contenedor.querySelector<HTMLParagraphElement>('#mensaje-error')!;
  const boton = contenedor.querySelector<HTMLButtonElement>('#btn-login')!;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensajeError.textContent = '';

    const usuario = (form.elements.namedItem('usuario') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    boton.disabled = true;
    boton.textContent = 'Ingresando...';

    try {
      const respuesta = await login(usuario, password);
      opciones.onLoginExitoso(respuesta.usuario);
    } catch (error) {
      if (error instanceof ApiError) {
        mensajeError.textContent = error.message;
      } else {
        mensajeError.textContent = 'No se pudo conectar con el servidor';
      }
    } finally {
      boton.disabled = false;
      boton.textContent = 'Iniciar sesión';
    }
  });
}
