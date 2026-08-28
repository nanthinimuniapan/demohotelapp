type D1 = { prepare(query: string): { bind(...values: unknown[]): { all<T>(): Promise<{ results: T[] }> } } };
type Context = { request: Request; env: { DB: D1 } };

export const onRequestGet = async ({ request, env }: Context) => {
  const params = new URL(request.url).searchParams;
  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  if (!checkIn || !checkOut || checkOut <= checkIn) return Response.json({ error: 'Choose a valid stay period.' }, { status: 400 });
  const query = `SELECT r.id, r.name, r.nightly_rate FROM rooms r WHERE r.active = 1 AND NOT EXISTS (SELECT 1 FROM bookings b WHERE b.room_id = r.id AND b.status IN ('demo_confirmed','paid') AND b.check_in < ?2 AND b.check_out > ?1)`;
  const result = await env.DB.prepare(query).bind(checkIn, checkOut).all<{ id: string; name: string; nightly_rate: number }>();
  return Response.json({ rooms: result.results });
};
