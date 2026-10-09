import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OTHER_CLASS, buildPayload, formatNom, formatPrenom, normalizeTunisianPhone, sanitizeRegistration, validateRegistration,
} from '../src/lib/validation.js';

const valid = { nom: 'Ben Salah', prenom: 'Amine', telephone: '22 123 456', classe: 'Ma classe', classeAutre: '', website: '', withSelect: false };

test('numéros tunisiens acceptés et normalisés', () => {
  for (const n of ['22123456', '+21622123456', '+216 22 123 456', '0021622123456', '216-22-123-456', '(+216) 98.765.432', '71 123 456']) {
    assert.match(normalizeTunisianPhone(n), /^\+216 \d{2} \d{3} \d{3}$/, n);
  }
  assert.equal(normalizeTunisianPhone('22123456'), '+216 22 123 456');
});

test('numéros invalides refusés', () => {
  for (const n of ['', '1234567', '221234567', '+33612345678', '02123456', '12345678', 'abcdefgh', '+216 2212345']) {
    assert.equal(normalizeTunisianPhone(n), null, n);
  }
});

test('formulaire valide : aucune erreur', () => {
  assert.deepEqual(validateRegistration(valid), {});
});

test('les 4 champs sont obligatoires', () => {
  const e = validateRegistration({ ...valid, nom: ' ', prenom: '', telephone: '', classe: '' });
  assert.deepEqual(Object.keys(e).sort(), ['classe', 'nom', 'prenom', 'telephone']);
});

test('noms : lettres (y compris arabes et accentuées), tirets, apostrophes', () => {
  for (const nom of ['Ben Salah', "M'barek", 'Ben-Ammar', 'Ghéribi', 'بن صالح']) {
    assert.equal(validateRegistration({ ...valid, nom }).nom, undefined, nom);
  }
  for (const nom of ['A', '123', '<script>', 'Amine2', '=SUM(A1)']) {
    assert.ok(validateRegistration({ ...valid, nom }).nom, nom);
  }
});

test('menu déroulant : « autre » doit être précisé', () => {
  const v = { ...valid, withSelect: true, classe: OTHER_CLASS, classeAutre: ' ' };
  assert.ok(validateRegistration(v).classeAutre);
  assert.equal(validateRegistration({ ...v, classeAutre: 'Ma classe' }).classeAutre, undefined);
  assert.equal(validateRegistration({ ...v, classe: '' }).classe, 'Veuillez sélectionner votre classe.');
});

test('mise en forme des noms', () => {
  assert.equal(formatNom('  ben   salah '), 'BEN SALAH');
  assert.equal(formatPrenom('mohamed-AMINE'), 'Mohamed-Amine');
  assert.equal(formatPrenom("o'neil"), "O'Neil");
});

test('payload et assainissement serveur', () => {
  const p = buildPayload({ ...valid, nom: '  ben  salah ' });
  assert.deepEqual(p, { nom: 'ben salah', prenom: 'Amine', telephone: '22 123 456', classe: 'Ma classe', website: '' });
  assert.deepEqual(sanitizeRegistration(p).data, { nom: 'BEN SALAH', prenom: 'Amine', telephone: '+216 22 123 456', classe: 'MA CLASSE' });
  assert.ok(sanitizeRegistration({ nom: 1, prenom: null }).errors.nom);
  assert.ok(sanitizeRegistration(null).errors);
});
