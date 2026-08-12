-- ============================================================
-- ESQUEMA DE BASE DE DATOS - Sistema de Racha de Login
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre_usuario VARCHAR(150) NOT NULL,
    racha_actual INTEGER NOT NULL DEFAULT 0,
    racha_maxima INTEGER NOT NULL DEFAULT 0,
    ultimo_login DATE NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historial_login (
    id_historial SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    fecha_login DATE NOT NULL,
    hora_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_fecha
        UNIQUE (id_usuario, fecha_login)
);

CREATE INDEX IF NOT EXISTS idx_historial_usuario ON historial_login(id_usuario);
