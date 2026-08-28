export type GuestInput = { name: string; email: string; phone: string };

export function calculateStayTotal(rate: number, checkIn: string, checkOut: string) {
  const nights = Math.max(1, Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000));
  return Math.round(rate * nights * 1.1);
}

export function validateGuest(input: GuestInput) {
  return {
    ...(input.name.trim() ? {} : { name: 'Enter your full name.' }),
    ...(/^\S+@\S+\.\S+$/.test(input.email) ? {} : { email: 'Enter a valid email address.' }),
    ...(input.phone.trim() ? {} : { phone: 'Enter a mobile number.' }),
  };
}

export function createBookingReference() {
  return `AUR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
