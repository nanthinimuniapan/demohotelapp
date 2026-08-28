import { authenticatedAdmin } from '../../lib/auth';
type Statement = { bind(...values: unknown[]): Statement; all<T>(): Promise<{ results: T[] }>; first<T>(): Promise<T | null> };
type Context = { request: Request; env: { DB: { prepare(query: string): Statement } } };
export const onRequestGet = async ({ request, env }: Context) => {
  if (!(await authenticatedAdmin(request, env.DB))) return Response.json({ error: 'Sign in required.' }, { status: 401 });
  const result = await env.DB.prepare(`SELECT b.id, b.reference, b.guest_name, b.guest_email, b.guest_phone, b.check_in, b.check_out, b.guests, b.status, b.payment_mode, r.name AS room_name FROM bookings b JOIN rooms r ON r.id = b.room_id ORDER BY b.check_in ASC`).all();
  return Response.json({ bookings: result.results });
};
