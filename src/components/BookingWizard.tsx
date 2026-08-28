import { FormEvent, useMemo, useState } from 'react';
import { rooms, type Room } from '../data/hotel';
import { calculateStayTotal, createBookingReference, validateGuest } from '../lib/booking';

type Props = { initialRoom?: string; onClose: () => void };
const date = new Date();
const iso = (offset: number) => new Date(date.getTime() + offset * 86400000).toISOString().slice(0, 10);

export function BookingWizard({ initialRoom = 'garden', onClose }: Props) {
  const [step, setStep] = useState(1);
  const [roomId, setRoomId] = useState(initialRoom);
  const [checkIn, setCheckIn] = useState(iso(14));
  const [checkOut, setCheckOut] = useState(iso(16));
  const [guests, setGuests] = useState(2);
  const [guest, setGuest] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<'demo' | 'curlec'>('demo');
  const [reference, setReference] = useState('');
  const room: Room = rooms.find((candidate) => candidate.id === roomId) ?? rooms[0];
  const total = useMemo(() => calculateStayTotal(room.price, checkIn, checkOut), [room, checkIn, checkOut]);
  const nights = Math.max(1, Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000));

  function continueToDetails() {
    const dateErrors: Record<string, string> = {};
    if (!checkIn || !checkOut || checkOut <= checkIn) dateErrors.dates = 'Choose a check-out date after check-in.';
    setErrors(dateErrors);
    if (!Object.keys(dateErrors).length) setStep(2);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateGuest(guest);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setReference(createBookingReference());
    setStep(3);
  }
  if (step === 3) return <div className="booking-shell confirmation" role="status"><button className="close" onClick={onClose} aria-label="Close booking">×</button><span className="check">✓</span><p className="kicker">Your stay is held</p><h2>Welcome to Aurelia House.</h2><p className="confirmation-copy">Your demo reservation is confirmed. No payment has been collected.</p><div className="itinerary"><span>{reference}</span><strong>{room.name}</strong><span>{checkIn} → {checkOut} · {guests} guests</span></div><button className="button dark" onClick={onClose}>Back to the house</button></div>;

  return <div className="booking-shell" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="close" onClick={onClose} aria-label="Close booking">×</button><div className="booking-head"><p className="kicker">Aurelia House / reservation</p><h2 id="booking-title">Make your stay yours.</h2><ol className="steps" aria-label="Booking steps"><li className={step === 1 ? 'active' : ''}>01 Stay</li><li className={step === 2 ? 'active' : ''}>02 Details</li><li>03 Confirm</li></ol></div><form noValidate onSubmit={submit}>
    {step === 1 && <section className="booking-grid"><div><label>Check-in<input type="date" value={checkIn} min={iso(1)} onChange={(e) => setCheckIn(e.target.value)} /></label><label>Check-out<input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} /></label><label>Guests<select value={guests} onChange={(e) => setGuests(Number(e.target.value))}><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label>{errors.dates && <p className="error">{errors.dates}</p>}<p className="field-label">Choose your room</p><div className="room-picks">{rooms.map((option) => <label className={`room-pick ${option.id === roomId ? 'selected' : ''}`} key={option.id}><input type="radio" name="room" checked={option.id === roomId} onChange={() => setRoomId(option.id)} /><span><strong>{option.name}</strong><small>from RM {option.price} / night</small></span></label>)}</div><button type="button" className="button dark" onClick={continueToDetails}>Continue to guest details <span>→</span></button></div><Summary room={room} nights={nights} total={total} /></section>}
    {step === 2 && <section className="booking-grid"><div><label>Full name<input value={guest.name} aria-invalid={Boolean(errors.name)} onChange={(e) => setGuest({...guest, name:e.target.value})} autoComplete="name" /></label>{errors.name && <p className="error">{errors.name}</p>}<label>Email address<input type="email" value={guest.email} aria-invalid={Boolean(errors.email)} onChange={(e) => setGuest({...guest, email:e.target.value})} autoComplete="email" /></label>{errors.email && <p className="error">{errors.email}</p>}<label>Mobile number<input type="tel" value={guest.phone} aria-invalid={Boolean(errors.phone)} onChange={(e) => setGuest({...guest, phone:e.target.value})} autoComplete="tel" /></label>{errors.phone && <p className="error">{errors.phone}</p>}<fieldset><legend>Payment</legend><label className="payment"><input type="radio" checked={payment === 'demo'} onChange={() => setPayment('demo')} /> <span><strong>Demo payment</strong><small>No payment will be collected. Use this to see the complete booking flow.</small></span></label><label className="payment disabled"><input type="radio" disabled checked={payment === 'curlec'} onChange={() => setPayment('curlec')} /> <span><strong>Razorpay Curlec</strong><small>Available once server credentials are configured.</small></span></label></fieldset><button className="text-button" type="button" onClick={() => setStep(1)}>← Change stay details</button><button className="button dark" type="submit">Confirm demo booking <span>→</span></button></div><Summary room={room} nights={nights} total={total} /></section>}
  </form></div>;
}
function Summary({ room, nights, total }: { room: Room; nights: number; total: number }) { return <aside className="summary"><img src={room.image} alt=""/><p className="kicker">Your selected room</p><h3>{room.name}</h3><div><span>{nights} nights</span><span>RM {room.price * nights}</span></div><div><span>Taxes & fees</span><span>RM {total - room.price * nights}</span></div><div className="summary-total"><strong>Total</strong><strong>RM {total}</strong></div><small>Includes 10% service tax.</small></aside>; }
