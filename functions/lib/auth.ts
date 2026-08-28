const encoder = new TextEncoder();
const iterations = 100_000;

const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map((item) => item.toString(16).padStart(2, '0')).join('');

export async function hashPassword(password: string, salt: string) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations, hash: 'SHA-256' }, material, 256);
  return hex(bits);
}

export async function verifyPassword(password: string, expectedHash: string, salt: string) {
  const actual = await hashPassword(password, salt);
  if (actual.length !== expectedHash.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  return difference === 0;
}

type SessionDb = { prepare(query: string): { bind(...values: unknown[]): { first<T>(): Promise<T | null> } } };
export async function authenticatedAdmin(request: Request, db: SessionDb) {
  const session = request.headers.get('Cookie')?.match(/(?:^|;\s*)aurelia_admin=([^;]+)/)?.[1];
  if (!session) return null;
  return db.prepare(`SELECT a.id, a.email FROM admin_sessions s JOIN admins a ON a.id = s.admin_id WHERE s.id = ?1 AND s.expires_at > ?2`).bind(session, new Date().toISOString()).first<{ id: string; email: string }>();
}
