import { verifyPassword } from '../../lib/auth';
type Statement = { bind(...values: unknown[]): Statement; first<T>(): Promise<T | null>; run(): Promise<unknown> };
type Context = { request: Request; env: { DB: { prepare(query: string): Statement } } };
export const onRequestPost = async ({ request, env }: Context) => {
  const { email, password } = await request.json() as { email?: string; password?: string };
  const admin = await env.DB.prepare('SELECT id, password_hash, password_salt FROM admins WHERE email = ?1').bind(email?.toLowerCase()).first<{ id: string; password_hash: string; password_salt: string }>();
  if (!admin || !password || !(await verifyPassword(password, admin.password_hash, admin.password_salt))) return Response.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  const session = crypto.randomUUID(); const expiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare('INSERT INTO admin_sessions (id, admin_id, expires_at) VALUES (?1, ?2, ?3)').bind(session, admin.id, expiry).run();
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': `aurelia_admin=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800` } });
};
