import { id, type User, type Role } from './domain';

function bytesToHex(bytes: Uint8Array): string { return [...bytes].map(x => x.toString(16).padStart(2, '0')).join('') }
function hexToBytes(hex: string): Uint8Array { if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2) throw new Error('Credencial inválida.'); return Uint8Array.from(hex.match(/.{2}/g)!.map(x => parseInt(x, 16))) }
async function derive(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: hexToBytes(salt) as BufferSource, iterations: 210000, hash: 'SHA-256' }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}
export async function makeUser(name: string, password: string, role: Role): Promise<User> {
  if (!name.trim()) throw new Error('Ingresá un nombre de usuario.');
  if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  return { id: id(), name: name.trim(), role, salt, passwordHash: await derive(password, salt), active: true };
}
export async function checkPassword(user: User, password: string): Promise<boolean> {
  const candidate = hexToBytes(await derive(password, user.salt));
  const stored = hexToBytes(user.passwordHash);
  if (candidate.length !== stored.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) diff |= candidate[i] ^ stored[i];
  return diff === 0;
}
