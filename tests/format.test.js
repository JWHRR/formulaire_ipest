import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPORT_FILTERS, formatDateTime, groupByClass, matchesSearch, toCsv, tunisDay } from '../src/admin/format.js';

const r = (id, nom, prenom, classe, createdAt = '2026-10-09T10:00:00.000Z', telephone = '+216 22 123 456') =>
  ({ id, rank: id, nom, prenom, classe, telephone, createdAt });

test('dates à l’heure de Tunis', () => {
  assert.equal(tunisDay('2026-10-09T23:30:00Z'), '2026-10-10');
  assert.equal(formatDateTime('2026-10-09T13:05:00Z'), '09/10/2026 à 14:05');
});

test('regroupement par classe insensible à la casse/espaces', () => {
  const g = groupByClass([r(1, 'A', 'a', 'MP 1'), r(2, 'B', 'b', 'mp1'), r(3, 'C', 'c', 'MP 1'), r(4, 'D', 'd', 'PC')]);
  assert.deepEqual(g.map((x) => [x.label, x.count]), [['MP 1', 3], ['PC', 1]]);
});

test('recherche : accents, ordre des mots, chiffres du téléphone', () => {
  const x = r(1, 'GHÉRIBI', 'Amine', 'PC');
  assert.ok(matchesSearch(x, 'gheribi'));
  assert.ok(matchesSearch(x, 'amine gher'));
  assert.ok(matchesSearch(x, '123 456'));
  assert.ok(!matchesSearch(x, 'salah'));
});

test('CSV : BOM, séparateur ;, téléphone en texte, injection neutralisée', () => {
  const csv = toCsv([r(1, 'BEN; SALAH', 'Amine', '=CMD()')]);
  assert.ok(csv.startsWith('﻿N°;Nom;Prénom;Téléphone;Classe;Chambre (foyer);Sport;'));
  const line = csv.split('\r\n')[1];
  assert.equal(line, `1;"BEN; SALAH";Amine;"=""+216 22 123 456""";'=CMD();Hors foyer;Non précisé;09/10/2026 à 11:00`);
  assert.ok(toCsv([{ ...r(2, 'X', 'Y', 'PC'), chambre: 'B12', sport: 'badminton,fitness' }]).includes(';PC;B12;Badminton, Fitness;'));
});

test('filtres par sport : un inscrit à plusieurs sports compte dans chacun', () => {
  const rows = ['ping-pong', 'badminton,fitness', 'ping-pong,badminton,fitness', null].map((sport, i) => ({ ...r(i + 1, 'A', 'b', 'PC'), sport }));
  assert.deepEqual(rows.filter(SPORT_FILTERS['ping-pong'].test).map((x) => x.id), [1, 3]);
  assert.deepEqual(rows.filter(SPORT_FILTERS.badminton.test).map((x) => x.id), [2, 3]);
  assert.deepEqual(rows.filter(SPORT_FILTERS.fitness.test).map((x) => x.id), [2, 3]);
  assert.ok(matchesSearch(rows[1], 'fitness'));
  assert.ok(!matchesSearch(rows[0], 'fitness'));
});
