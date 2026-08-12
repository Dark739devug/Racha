/**
 * Utilidad para generar hashes bcrypt válidos para los usuarios de prueba.
 * No se puede escribir un hash bcrypt "a mano" de forma confiable, por eso
 * este script lo genera usando la misma librería que usa el backend.
 *
 * Uso:
 *   cd backend
 *   node ../sql/generar-hash.js "123456789"
 *
 * (requiere que ya hayas hecho `npm install` dentro de backend/,
 *  porque usa la dependencia bcrypt instalada ahí)
 */
const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('Uso: node generar-hash.js "tu_password"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nPassword en texto plano:', password);
  console.log('Hash bcrypt generado:   ', hash);
  console.log('\nCopia ese hash dentro de datos-prueba.sql en la columna "password".\n');
});
