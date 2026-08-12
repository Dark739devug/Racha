# Guía paso a paso — Sistema de Racha de Login

Stack: Vite → NestJS → PostgreSQL (Supabase), desplegado en Vercel + Render.

## Paso 1 — Crear el proyecto en Supabase
- Qué: crear un proyecto nuevo en https://supabase.com.
- Por qué: aloja la base de datos PostgreSQL en la nube.
- Resultado esperado: tienes un proyecto con host, puerto, usuario, password y nombre de base de datos.
- Cómo comprobarlo: en **Project Settings → Database** ves la cadena de conexión.

## Paso 2 — Crear las tablas
- Qué: correr `sql/schema.sql` en el **SQL Editor** de Supabase.
- Por qué: crea `usuarios` e `historial_login`, con la restricción `UNIQUE(id_usuario, fecha_login)` que impide duplicar la racha en el mismo día.
- Archivo: `sql/schema.sql`.
- Cómo comprobarlo: en **Table Editor** aparecen ambas tablas.

## Paso 3 — Crear el backend NestJS
- Qué: usar la carpeta `backend/` de este proyecto (o `nest new backend` si empiezas desde cero y copias los archivos).
- Por qué: es donde vive toda la lógica de negocio (obligatorio según el enunciado).
- Resultado esperado: estructura `src/auth`, `src/usuarios`, `src/rachas`.

## Paso 4 — Configurar TypeORM
- Qué: `AppModule` usa `TypeOrmModule.forRootAsync` leyendo variables de entorno con `ConfigService`.
- Por qué: evita credenciales hardcodeadas en el código.
- Archivo: `backend/src/app.module.ts`.
- Detalle clave: `synchronize: config.get('DB_SYNCHRONIZE') === 'true'` (comparación de string, no `Boolean(...)`).

## Paso 5 — Configurar el `.env`
- Qué: copiar `backend/.env.example` a `backend/.env` y llenar credenciales.
- Por qué: separa configuración sensible del código fuente.
- Cuidado: `DB_DATABASE` debe ser el **nombre de la base**, nunca el nombre de un archivo `.sql`.

## Paso 6 — Módulo de usuarios
- Qué: `Usuario` entity + `UsuarioService` + `UsuarioController`.
- Por qué: administra los datos de usuario y expone `GET /usuarios/:id/racha`.
- Archivos: `backend/src/usuarios/*`.

## Paso 7 — Login
- Qué: `POST /auth/login` valida usuario/contraseña con bcrypt.
- Archivo: `backend/src/auth/*`.
- Resultado esperado: 200 con los datos del usuario (sin password), 401 si la contraseña es incorrecta, 404 si el usuario no existe.

## Paso 8 — Lógica de rachas
- Qué: `RachaService.calcularNuevaRacha()` implementa exactamente la lógica del enunciado usando fechas calendario (sin horas), vía `FechaUtil`.
- Por qué: es el núcleo del ejercicio; se probó contra los 6 casos de la sección 5 del enunciado.
- Archivo: `backend/src/rachas/racha.service.ts` y `backend/src/common/utils/fecha.util.ts`.

## Paso 9 — Pruebas del backend con Postman/Thunder Client
- Qué: correr `npm install && npm run start:dev` dentro de `backend/` y probar los endpoints (ver sección "Pruebas" abajo).
- Resultado esperado: login exitoso devuelve racha actualizada; segundo login el mismo día NO incrementa la racha.

## Paso 10 — Insertar datos históricos manualmente
- Qué: generar un hash real con `node sql/generar-hash.js "123456789"` (después de `npm install` en backend), pegarlo en `sql/datos-prueba.sql`, y correr ese script en Supabase.
- Por qué: demuestra una racha de varios días sin tener que hacer login real 5 días seguidos.
- Archivo: `sql/datos-prueba.sql`.

## Paso 11 — Crear el frontend Vite
- Qué: la carpeta `frontend/` ya está lista con TypeScript puro (sin framework adicional).
- Archivos: `frontend/src/main.ts`, `components/LoginForm.ts`, `components/Dashboard.ts`, `services/api.ts`.

## Paso 12 — Conexión Vite → NestJS
- Qué: `services/api.ts` usa `import.meta.env.VITE_API_URL` para todas las llamadas; nunca hay un `localhost` hardcodeado en los componentes.
- Cómo comprobarlo: buscar "localhost" en `frontend/src` no debe dar resultados fuera de `.env`.

## Paso 13 — Dashboard
- Qué: `Dashboard.ts` sólo pinta los datos que ya vienen calculados del backend (racha actual, racha máxima, último login). No hay ninguna lógica de negocio en el frontend.

## Paso 14 — Subir a GitHub
- Qué: `git init`, confirmar que `.env` está en `.gitignore` (ya viene configurado en `backend/.gitignore` y `frontend/.gitignore`), `git add .`, commit, push.
- Cómo comprobarlo: en GitHub no debe aparecer ningún archivo `.env` con contraseñas reales.

## Paso 15 — Publicar NestJS en Render
- Qué: crear un **Web Service** en Render apuntando a la carpeta `backend/`.
- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`
- Por qué: Render necesita compilar TypeScript (`nest build`) antes de ejecutar `dist/main.js`.

## Paso 16 — Variables de entorno en Render
- Qué: agregar en el panel de Render las mismas variables de `backend/.env.example`, con las credenciales reales de Supabase y `DB_SSL_REQUIRED=true`.
- `FRONTEND_URL` debe apuntar al dominio final de Vercel (puede llevar varios dominios separados por coma).
- Nota: Render inyecta `PORT` automáticamente; el backend ya usa `process.env.PORT`.

## Paso 17 — Publicar Vite en Vercel
- Qué: importar el repositorio en Vercel, seleccionando `frontend/` como *root directory*.
- Build Command: `npm run build` (o el que detecte Vercel para Vite).

## Paso 18 — Configurar `VITE_API_URL`
- Qué: en **Project Settings → Environment Variables** de Vercel, agregar `VITE_API_URL=https://tu-backend.onrender.com`.
- Por qué: sin esta variable el frontend intentaría llamar a `localhost` en producción.
- Después de agregarla: hacer **Redeploy**.

## Paso 19 — Configurar CORS
- Qué: en Render, actualizar `FRONTEND_URL` con el dominio real de Vercel una vez publicado.
- Archivo: `backend/src/main.ts` ya lee `FRONTEND_URL` y permite varios orígenes separados por coma.

## Paso 20 — Prueba completa del sistema publicado
- Qué: abrir la URL de Vercel, iniciar sesión con un usuario de prueba, confirmar que el dashboard muestra la racha correcta.
- Cómo comprobarlo: revisar en Supabase que `usuarios.ultimo_login` y `historial_login` se actualizaron.

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Login + actualización de racha |
| GET | `/usuarios/:id/racha` | Estado actual de racha de un usuario |

## JSON para probar en Postman

**POST `{{VITE_API_URL}}/auth/login`**
```json
{
  "usuario": "esdras",
  "password": "123456789"
}
```

**GET `{{VITE_API_URL}}/usuarios/1/racha`** (sin body)

## Escenarios de prueba manual (según sección 5 del enunciado)

1. Usuario sin `ultimo_login` → login → `racha_actual = 1`, `racha_maxima = 1`.
2. `ultimo_login` = ayer → login hoy → `racha_actual += 1`.
3. `ultimo_login` = hace 2+ días → login hoy → `racha_actual = 1`.
4. Login dos veces el mismo día → la racha solo sube una vez (probar llamando `/auth/login` dos veces seguidas).
5. `racha_actual = 7`, `racha_maxima = 7` → login al día siguiente → ambas quedan en 8.
6. `racha_actual = 3`, `racha_maxima = 10`, se rompe la racha → `racha_actual = 1`, `racha_maxima` sigue en 10.

## Lista final de comprobación

- [ ] `schema.sql` ejecutado en Supabase.
- [ ] `datos-prueba.sql` ejecutado con hashes reales de bcrypt.
- [ ] `backend/.env` configurado localmente (no subido a Git).
- [ ] Login funciona local (`POST /auth/login`).
- [ ] La racha no se duplica en logins repetidos el mismo día.
- [ ] Racha máxima nunca disminuye.
- [ ] Frontend consume `VITE_API_URL`, sin `localhost` hardcodeado.
- [ ] Dashboard muestra nombre, racha actual, racha máxima y último login.
- [ ] Backend publicado en Render, respondiendo en su URL pública.
- [ ] Variables de entorno cargadas en Render (incluyendo `DB_SSL_REQUIRED=true`).
- [ ] Frontend publicado en Vercel con `VITE_API_URL` apuntando a Render.
- [ ] CORS de Render permite el dominio real de Vercel.
- [ ] Prueba end-to-end funcionando en producción (Vercel → Render → Supabase).
- [ ] `.env` real no está en GitHub; `.env.example` sí.
