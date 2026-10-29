import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeRemaining } from '../src/lib/countdown.js';

const DEADLINE = new Date('2026-11-03T00:00:00+01:00').getTime();

test('date limite = 2 novembre 2026 minuit, heure de Tunis (config)', async () => {
  const { DEADLINE_ISO } = await import('../src/config.js');
  assert.equal(new Date(DEADLINE_ISO).toISOString(), '2026-11-02T23:00:00.000Z');
  assert.equal(new Date(DEADLINE).toISOString(), '2026-11-02T23:00:00.000Z');
});

test('décomposition jours / heures / minutes / secondes', () => {
  const now = DEADLINE - ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
  assert.deepEqual(timeRemaining(DEADLINE, now), { total: DEADLINE - now, days: 2, hours: 3, minutes: 4, seconds: 5 });
});

test('après la date limite : zéro', () => {
  assert.equal(timeRemaining(DEADLINE, DEADLINE + 1000).total, 0);
});
