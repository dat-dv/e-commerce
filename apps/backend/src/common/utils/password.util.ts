import * as crypto from 'crypto';

const PASSWORD_ALGORITHM = 'scrypt';
const PASSWORD_KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString('hex');
  return `${PASSWORD_ALGORITHM}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  const [algorithm, salt, hash] = storedPassword.split('$');
  if (algorithm !== PASSWORD_ALGORITHM || !salt || !hash) return false;

  const candidate = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  const stored = Buffer.from(hash, 'hex');

  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}
