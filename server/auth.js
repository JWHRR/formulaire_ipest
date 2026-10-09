// Authentification de l'espace organisateur : mot de passe unique (ADMIN_PASSWORD)
// et cookie de session signé (HMAC-SHA256), HttpOnly, valable 12 heures.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { ConfigError, send } from './http.js';

const COOKIE = 'ipest_admin';
const MAX_AGE = 12 * 60 * 60; // secondes

function password() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new ConfigError('ADMIN_PASSWORD n’est pas défini.');
  return pw;
}

function key() {
  // Changer ADMIN_PASSWORD (ou SESSION_SECRET) invalide toutes les sessions ouvertes.
  return process.env.SESSION_SECRET || createHash('sha256').update(`ipest-admin-session:${password()}`).digest();
}

const sign = (exp) => createHmac('sha256', key()).update(`v1.${exp}`).digest('base64url');

function safeEqual(a, b) {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export const checkPassword = (input) => typeof input === 'string' && safeEqual(input, password());

function cookieAttrs(req) {
  const secure = process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
  return `; Path=/api/admin; HttpOnly; SameSite=Strict${secure}`;
}

export function sessionCookie(req) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${COOKIE}=${exp}.${sign(exp)}; Max-Age=${MAX_AGE}${cookieAttrs(req)}`;
}

export const clearedCookie = (req) => `${COOKIE}=; Max-Age=0${cookieAttrs(req)}`;

export function isAuthenticated(req) {
  const header = req.headers.cookie || '';
  const raw = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const [expStr, sig] = raw.slice(COOKIE.length + 1).split('.');
  const exp = Number(expStr);
  if (!Number.isInteger(exp) || !sig || exp < Date.now() / 1000) return false;
  return safeEqual(sig, sign(exp));
}

/** Renvoie true si la requête est authentifiée ; sinon répond 401 et renvoie false. */
export function requireAdmin(req, res) {
  if (isAuthenticated(req)) return true;
  send(res, 401, { ok: false, code: 'unauthorized', error: 'Session expirée. Veuillez vous reconnecter.' });
  return false;
}
