import { test } from 'node:test';
import assert from 'node:assert/strict';
import { submitRegistration, SubmissionError } from '../src/lib/submit.js';

const reply = (status, body) => async () => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
const opts = (fetchImpl) => ({ endpoint: 'http://x/api/register', fetchImpl });

test('succès uniquement si le serveur répond ok:true', async () => {
  const r = await submitRegistration({}, opts(reply(201, { ok: true, id: 7 })));
  assert.equal(r.id, 7);
});

for (const [name, impl] of [
  ['page HTML', reply(200, '<html></html>')],
  ['JSON sans ok', reply(200, { saved: true })],
  ['HTTP 500', reply(500, { ok: true })],
  ['réseau coupé', async () => { throw new TypeError('Failed to fetch'); }],
]) {
  test(`échec : ${name}`, async () => {
    await assert.rejects(submitRegistration({}, opts(impl)), SubmissionError);
  });
}

test('doublon : message serveur, non réessayable, erreur de champ transmise', async () => {
  const impl = reply(409, { ok: false, code: 'duplicate', error: 'Déjà inscrit.', fields: { telephone: 'x' } });
  await assert.rejects(submitRegistration({}, opts(impl)), (e) => e.message === 'Déjà inscrit.' && !e.retryable && e.fields.telephone === 'x');
});

test('erreur serveur : réessayable', async () => {
  await assert.rejects(submitRegistration({}, opts(reply(500, { ok: false, code: 'server', error: 'Oups' }))), (e) => e.retryable);
});

test('délai dépassé', async () => {
  const hang = (u, { signal }) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(Object.assign(new Error('x'), { name: 'AbortError' }))));
  await assert.rejects(submitRegistration({}, { fetchImpl: hang, timeoutMs: 20 }), (e) => e.code === 'timeout');
});
