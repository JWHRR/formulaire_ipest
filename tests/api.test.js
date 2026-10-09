// Tests des fonctions API contre un vrai PostgreSQL embarqué (PGlite).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

process.env.ADMIN_PASSWORD = 'mot-de-passe-test-123';
const pg = new PGlite();
globalThis.__IPEST_DEV_DB__ = { query: async (t, p) => (await pg.query(t, p)).rows };

const register = (await import('../api/register.js')).default;
const login = (await import('../api/admin/login.js')).default;
const session = (await import('../api/admin/session.js')).default;
const logout = (await import('../api/admin/logout.js')).default;
const registrations = (await import('../api/admin/registrations.js')).default;

async function call(handler, { method = 'GET', body, url = '/', cookie, ip = '1.2.3.4' } = {}) {
  const headers = { 'x-forwarded-for': ip, ...(cookie ? { cookie } : {}) };
  const req = { method, url, headers, body: body === undefined ? undefined : JSON.stringify(body) };
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(b) { this.raw = b; },
  };
  await handler(req, res);
  return { status: res.statusCode, data: JSON.parse(res.raw), headers: res.headers };
}

const student = { nom: 'ben salah', prenom: 'amine', telephone: '22 123 456', classe: 'Classe A', website: '' };
let cookie;

before(async () => {
  const r = await call(login, { method: 'POST', body: { password: process.env.ADMIN_PASSWORD }, ip: '9.9.9.9' });
  cookie = r.headers['set-cookie'].split(';')[0];
});

test('inscription valide → 201 et enregistrée (normalisée)', async () => {
  const r = await call(register, { method: 'POST', body: student });
  assert.equal(r.status, 201);
  assert.equal(r.data.ok, true);
  const rows = await globalThis.__IPEST_DEV_DB__.query('SELECT * FROM registrations');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].nom, 'BEN SALAH');
  assert.equal(rows[0].prenom, 'Amine');
  assert.equal(rows[0].telephone, '+216 22 123 456');
});

test('même numéro (autre format) → 409 doublon', async () => {
  const r = await call(register, { method: 'POST', body: { ...student, nom: 'Autre', telephone: '+216 22123456' } });
  assert.equal(r.status, 409);
  assert.equal(r.data.code, 'duplicate');
});

test('champs invalides → 400 avec erreurs par champ', async () => {
  const r = await call(register, { method: 'POST', body: { ...student, classe: '', telephone: '123' } });
  assert.equal(r.status, 400);
  assert.ok(r.data.fields.classe && r.data.fields.telephone);
});

test('robot (champ piège) → refusé', async () => {
  const r = await call(register, { method: 'POST', body: { ...student, telephone: '55 000 000', website: 'spam' } });
  assert.equal(r.status, 400);
});

test('JSON invalide → 400 ; GET → 405', async () => {
  const req = { method: 'POST', url: '/', headers: {}, body: '{oops' };
  const res = { setHeader() {}, end(b) { this.raw = b; } };
  await register(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal((await call(register, { method: 'GET' })).status, 405);
});

test('après la date limite → 403 closes', async (t) => {
  t.mock.method(Date, 'now', () => new Date('2026-10-13T00:00:01+01:00').getTime());
  const r = await call(register, { method: 'POST', body: { ...student, telephone: '55 111 222' } });
  assert.equal(r.status, 403);
  assert.equal(r.data.code, 'closed');
});

test('admin : accès refusé sans session valide', async () => {
  assert.equal((await call(registrations)).status, 401);
  assert.equal((await call(registrations, { cookie: 'ipest_admin=9999999999.fake' })).status, 401);
  assert.equal((await call(session)).data.authenticated, false);
});

test('admin : cookie sécurisé (HttpOnly, SameSite=Strict) et déconnexion', async () => {
  const r = await call(login, { method: 'POST', body: { password: process.env.ADMIN_PASSWORD }, ip: '8.8.8.8' });
  assert.match(r.headers['set-cookie'], /HttpOnly; SameSite=Strict/);
  assert.equal((await call(session, { cookie })).data.authenticated, true);
  assert.match((await call(logout, { method: 'POST' })).headers['set-cookie'], /Max-Age=0/);
});

test('admin : liste puis suppression', async () => {
  await call(register, { method: 'POST', body: { ...student, prenom: 'Sarra', telephone: '98 765 432' } });
  const list = await call(registrations, { cookie });
  assert.equal(list.status, 200);
  assert.equal(list.data.registrations.length, 2);
  assert.match(list.data.registrations[0].createdAt, /^\d{4}-\d\d-\d\dT/);

  const id = list.data.registrations[1].id;
  const del = (q) => call(registrations, { method: 'DELETE', url: `/api/admin/registrations?id=${q}`, cookie });
  assert.equal((await del(id)).status, 200);
  assert.equal((await del(id)).status, 404);
  assert.equal((await del('abc')).status, 400);
  assert.equal((await call(registrations, { cookie })).data.registrations.length, 1);
});

test('admin : blocage après 8 mauvais mots de passe (par adresse IP)', async () => {
  for (let i = 0; i < 8; i++) {
    assert.equal((await call(login, { method: 'POST', body: { password: 'faux' }, ip: '6.6.6.6' })).status, 401);
  }
  const blocked = await call(login, { method: 'POST', body: { password: process.env.ADMIN_PASSWORD }, ip: '6.6.6.6' });
  assert.equal(blocked.status, 429);
  assert.equal((await call(login, { method: 'POST', body: { password: process.env.ADMIN_PASSWORD }, ip: '7.7.7.7' })).status, 200);
});
