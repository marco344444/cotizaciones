import { randomBytes } from "crypto";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Genera un identificador corto, único y seguro para las URLs
 * de las cotizaciones (base62, ~60 bits de entropía con 10 caracteres).
 */
export function generarSlug(longitud = 10): string {
  const bytes = randomBytes(longitud);
  let slug = "";
  for (const byte of bytes) {
    slug += ALPHABET[byte % ALPHABET.length];
  }
  return slug;
}

export function generarId(): string {
  return generarSlug(8);
}
