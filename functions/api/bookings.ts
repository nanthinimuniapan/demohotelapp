type Statement = { bind(...values: unknown[]): Statement; first<T>(): Promise<T | null>; run(): Promise<unknown> };
type D1 = { prepare(query: string): Statement };
type Context = { request: Request; env: { DB: D1 } };
type Draft = { roomId: string; checkIn: string; checkOut: string; guests: number; guest: { name: string; email: string; phone: string }; paymentMode: 'demo' | 'curlec'; idempotencyKey: string };
const reference = () => `AUR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

export const onRequestPost = async ({ request, env }: Context) => {
  const draft = await request.json() as Draft;
  if (!draft.roomId || !draft.checkIn || !draft.checkOut || draft.checkOut <= draft.checkIn || !draft.guest?.name || !/^\S+@\S+\.\S+$/.test(draft.guest.email) || !draft.guest.phone || !draft.idempotencyKey) return Response.json({ error: 'Review the booking details and try again.' }, { status: 400 });
  if (draft.paymentMode === 'curlec') return Response.json({ error: 'Razorpay Curlec is not configured for this demo.' }, { status: 503 });
  const existing = await env.DB.prepare('SELECT reference, status FROM bookings WHERE idempotency_key = ?1').bind(draft.idempotencyKey).first<{ reference: string; status: string }>();
  if (existing) return Response.json(existing, { status: 200 });
  const conflict = await env.DB.prepare(`SELECT id FROM bookings WHERE room_id = ?1 AND status IN ('demo_confirmed','paid') AND check_in < ?3 AND check_out > ?2 LIMIT 1`).bind(draft.roomId, draft.checkIn, draft.checkOut).first();
  if (conflict) return Response.json({ error: 'That room is no longer available for these dates.' }, { status: 409 });
  const bookingReference = reference();
  await env.DB.prepare(`INSERT INTO bookings (id, reference, room_id, check_in, check_out, guests, guest_name, guest_email, guest_phone, payment_mode, status, idempotency_key) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'demo', 'demo_confirmed', ?10)`).bind(crypto.randomUUID(), bookingReference, draft.roomId, draft.checkIn, draft.checkOut, draft.guests, draft.guest.name, draft.guest.email, draft.guest.phone, draft.idempotencyKey).run();
  return Response.json({ reference: bookingReference, status: 'demo_confirmed' }, { status: 201 });
};
