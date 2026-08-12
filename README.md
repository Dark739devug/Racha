# Sistema de Racha de Login

Stack: **NestJS + TypeORM + PostgreSQL (Supabase)** en el backend, **Vite (TypeScript)** en el frontend.

## Estructura

```
backend/    -> API NestJS (lógica de racha, login, TypeORM)
frontend/   -> App Vite (login + dashboard)
sql/        -> schema.sql, datos-prueba.sql, generar-hash.js
GUIA-PASO-A-PASO.md -> guía completa de 20 pasos + checklist para la entrega
```

## Arranque local rápido

```bash
# 1) Base de datos
#   - Crear proyecto en Supabase (o usar Postgres local)
#   - Correr sql/schema.sql

# 2) Backend
cd backend
cp .env.example .env   # completar credenciales
npm install
npm run start:dev      # http://localhost:3000

# 3) Datos de prueba (opcional, para demostrar racha sin loguear 5 días)
node ../sql/generar-hash.js "123456789"
# pegar el hash resultante en sql/datos-prueba.sql y correrlo en Supabase

# 4) Frontend
cd ../frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev             # http://localhost:5173
```

Ver `GUIA-PASO-A-PASO.md` para el proceso completo, incluyendo despliegue en Render y Vercel.
