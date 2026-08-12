/**
 * Utilidades para trabajar con FECHAS CALENDARIO (sin hora).
 *
 * Todo se maneja como string 'YYYY-MM-DD' para evitar los problemas
 * clásicos de zona horaria al comparar objetos Date directamente
 * (ej. restar milisegundos y dividir entre 86400000, que se rompe
 * en cambios de horario de verano o cuando el server y el usuario
 * están en zonas horarias distintas).
 *
 * La zona horaria "de negocio" se define con la variable de entorno
 * APP_TIMEZONE (por defecto UTC). Es la zona horaria que se usa para
 * decidir "qué día es hoy" a nivel de negocio, no la del servidor.
 */

export class FechaUtil {
  /**
   * Devuelve la fecha de HOY como 'YYYY-MM-DD' en la zona horaria
   * configurada en APP_TIMEZONE.
   */
  static hoy(): string {
    const zona = process.env.APP_TIMEZONE || 'UTC';
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: zona,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    // 'en-CA' formatea nativamente como YYYY-MM-DD
    return formatter.format(new Date());
  }

  /**
   * Devuelve el día calendario anterior a una fecha 'YYYY-MM-DD' dada,
   * también como 'YYYY-MM-DD'. El cálculo se hace en UTC "puro"
   * (sin horas) para que restar un día sea siempre exacto.
   */
  static diaAnterior(fechaISO: string): string {
    const [anio, mes, dia] = fechaISO.split('-').map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));
    fecha.setUTCDate(fecha.getUTCDate() - 1);
    return fecha.toISOString().slice(0, 10);
  }

  /**
   * Compara dos fechas 'YYYY-MM-DD' como cadenas (funciona porque el
   * formato ISO ordena lexicográficamente igual que cronológicamente).
   */
  static sonIguales(fechaA: string | null, fechaB: string | null): boolean {
    if (!fechaA || !fechaB) return false;
    return fechaA === fechaB;
  }

  /**
   * Normaliza un valor de fecha que puede venir de TypeORM/Postgres
   * como string 'YYYY-MM-DD' o como objeto Date, siempre a string
   * 'YYYY-MM-DD'. Devuelve null si el valor es null/undefined.
   */
  static normalizar(valor: string | Date | null | undefined): string | null {
    if (!valor) return null;
    if (typeof valor === 'string') {
      // Por si viniera con hora incluida, nos quedamos solo con la fecha
      return valor.slice(0, 10);
    }
    return valor.toISOString().slice(0, 10);
  }
}
