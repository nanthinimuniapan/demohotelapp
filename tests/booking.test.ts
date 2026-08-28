import { describe, expect, it } from 'vitest';
import { calculateStayTotal, validateGuest } from '../src/lib/booking';

describe('booking utilities', () => {
  it('prices a two-night stay plus 10% taxes', () => {
    expect(calculateStayTotal(480, '2026-09-10', '2026-09-12')).toBe(1056);
  });

  it('requires guest contact fields', () => {
    expect(validateGuest({ name: '', email: 'not-an-email', phone: '' })).toEqual({
      name: 'Enter your full name.', email: 'Enter a valid email address.', phone: 'Enter a mobile number.'
    });
  });
});
