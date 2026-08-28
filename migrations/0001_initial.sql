CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nightly_rate INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
INSERT INTO rooms (id, name, nightly_rate) VALUES
  ('garden', 'Garden Verandah', 480),
  ('heritage', 'Heritage Suite', 690),
  ('terrace', 'Terrace Residence', 920);

CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  room_id TEXT NOT NULL REFERENCES rooms(id),
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  guests INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  payment_mode TEXT NOT NULL,
  status TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX booking_dates ON bookings(room_id, check_in, check_out);
