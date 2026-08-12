-- ============================================================
-- DATOS DE PRUEBA - Sistema de Racha de Login
-- Ejecutar DESPUÉS de schema.sql
--
-- IMPORTANTE: reemplaza HASH_AQUI por un hash bcrypt real.
-- Genera uno con:  node sql/generar-hash.js "123456789"
-- (después de haber corrido "npm install" en backend/)
-- ============================================================

-- ------------------------------------------------------------
-- CASO 1: Esdras Pérez -> racha activa de 5 días consecutivos
-- 08/08/2026, 09/08/2026, 10/08/2026, 11/08/2026, 12/08/2026
-- Resultado esperado: racha_actual = 5, racha_maxima = 5
-- (si hoy en el sistema es 12/08/2026; ajusta las fechas si
--  las pruebas se corren otro día)
-- ------------------------------------------------------------
INSERT INTO usuarios (usuario, password, nombre_usuario, racha_actual, racha_maxima, ultimo_login, activo)
VALUES (
    'esdras',
    'HASH_AQUI',
    'Esdras Pérez',
    5,
    5,
    '2026-08-12',
    TRUE
)
ON CONFLICT (usuario) DO NOTHING;

INSERT INTO historial_login (id_usuario, fecha_login)
SELECT id_usuario, fecha
FROM usuarios, (VALUES
    ('2026-08-08'::date),
    ('2026-08-09'::date),
    ('2026-08-10'::date),
    ('2026-08-11'::date),
    ('2026-08-12'::date)
) AS fechas(fecha)
WHERE usuario = 'esdras'
ON CONFLICT (id_usuario, fecha_login) DO NOTHING;

-- ------------------------------------------------------------
-- CASO 2: María López -> racha interrumpida
-- Racha de 3 días (01,02,03/08) y luego otra racha de 2 días (06,07/08)
-- Resultado esperado: racha_maxima = 3, racha_actual = 2
-- ------------------------------------------------------------
INSERT INTO usuarios (usuario, password, nombre_usuario, racha_actual, racha_maxima, ultimo_login, activo)
VALUES (
    'maria',
    'HASH_AQUI',
    'María López',
    2,
    3,
    '2026-08-07',
    TRUE
)
ON CONFLICT (usuario) DO NOTHING;

INSERT INTO historial_login (id_usuario, fecha_login)
SELECT id_usuario, fecha
FROM usuarios, (VALUES
    ('2026-08-01'::date),
    ('2026-08-02'::date),
    ('2026-08-03'::date),
    ('2026-08-06'::date),
    ('2026-08-07'::date)
) AS fechas(fecha)
WHERE usuario = 'maria'
ON CONFLICT (id_usuario, fecha_login) DO NOTHING;

-- ------------------------------------------------------------
-- CASO 3: Usuario nuevo, sin login previo -> primer login debe
-- dejar racha_actual = 1, racha_maxima = 1
-- ------------------------------------------------------------
INSERT INTO usuarios (usuario, password, nombre_usuario, racha_actual, racha_maxima, ultimo_login, activo)
VALUES (
    'nuevo',
    'HASH_AQUI',
    'Usuario Nuevo',
    0,
    0,
    NULL,
    TRUE
)
ON CONFLICT (usuario) DO NOTHING;

-- Verificación rápida
SELECT id_usuario, usuario, nombre_usuario, racha_actual, racha_maxima, ultimo_login
FROM usuarios
ORDER BY id_usuario;
