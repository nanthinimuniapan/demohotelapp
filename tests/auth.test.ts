import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../functions/lib/auth';

describe('admin password protection', () => {
  it('verifies the matching password but rejects another password', async () => {
    const stored = await hashPassword('AureliaDemo2026!', 'demo-salt');
    await expect(verifyPassword('AureliaDemo2026!', stored, 'demo-salt')).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', stored, 'demo-salt')).resolves.toBe(false);
  });
});
