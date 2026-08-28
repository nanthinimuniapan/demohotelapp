import { authenticatedAdmin } from '../../../../lib/auth';
type Statement = { bind(...values: unknown[]): Statement; first<T>(): Promise<T | null>; run(): Promise<unknown> };
type Context = { request: Request; params: { id: string }; env: { DB: { prepare(query: string): Statement } } };
export const onRequestPost = async ({ request, params, env }: Context) => {
  const admin = await authenticatedAdmin(request, env.DB); if (!admin) return Response.json({ error: 'Sign in required.' }, { status: 401 });
  const { action } = await request.json() as { action?: 'check_in' | 'check_out' };
  const booking = await env.DB.prepare('SELECT status FROM bookings WHERE id = ?1').bind(params.id).first<{ status: string }>();
  if (!booking) return Response.json({ error: 'Booking not found.' }, { status: 404 });
  const next = action === 'check_in' ? 'checked_in' : action === 'check_out' ? 'checked_out' : null;
  const valid = (booking.status === 'demo_confirmed' && next === 'checked_in') || (booking.status === 'checked_in' && next === 'checked_out');
  if (booking.status === next) return Response.json({ status: booking.status });
  if (!valid || !next) return Response.json({ error: 'This stay cannot make that transition.' }, { status: 409 });
  await env.DB.prepare('UPDATE bookings SET status = ?1 WHERE id = ?2').bind(next, params.id).run();
  await env.DB.prepare('INSERT INTO booking_status_history (id, booking_id, actor_admin_id, previous_status, next_status) VALUES (?1, ?2, ?3, ?4, ?5)').bind(crypto.randomUUID(), params.id, admin.id, booking.status, next).run();
  return Response.json({ status: next });
};
