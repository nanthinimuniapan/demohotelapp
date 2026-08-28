CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO admins (id, email, password_hash, password_salt) VALUES
  ('admin-demo', 'admin@aureliahouse.my', '1a35196f4a79de6105721548dec5fe00d6233ebb91ff31a24ea4a8a6d1bb42c7', 'demo-salt');

CREATE TABLE admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admins(id),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX admin_session_expiry ON admin_sessions(expires_at);

CREATE TABLE booking_status_history (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  actor_admin_id TEXT NOT NULL REFERENCES admins(id),
  previous_status TEXT NOT NULL,
  next_status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX booking_history_booking ON booking_status_history(booking_id, created_at);
