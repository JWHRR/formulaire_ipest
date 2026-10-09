// Outils de présentation des inscriptions (purs, testés dans tests/).

const TZ = 'Africa/Tunis';
const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const dateTimeFmt = new Intl.DateTimeFormat('fr-FR', {
  timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

export const tunisDay = (date) => dayFmt.format(new Date(date)); // AAAA-MM-JJ
export const formatDateTime = (iso) => {
  const p = Object.fromEntries(dateTimeFmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} à ${p.hour}:${p.minute}`;
};
export const formatTime = (date) => timeFmt.format(new Date(date));

export const fold = (s) => String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
export const classKey = (c) => fold(c).replace(/[\s.\-_/]/g, '');

/** Regroupe par classe (insensible à la casse, aux accents et aux espaces). Tri décroissant. */
export function groupByClass(rows) {
  const groups = new Map();
  for (const r of rows) {
    const key = classKey(r.classe);
    if (!groups.has(key)) groups.set(key, { key, labels: new Map(), count: 0 });
    const g = groups.get(key);
    g.count += 1;
    g.labels.set(r.classe, (g.labels.get(r.classe) || 0) + 1);
  }
  return [...groups.values()]
    .map((g) => ({ key: g.key, count: g.count, label: [...g.labels.entries()].sort((a, b) => b[1] - a[1])[0][0] }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr', { numeric: true }));
}

export function matchesSearch(r, q) {
  const query = fold(q).trim();
  if (!query) return true;
  const digits = query.replace(/\D/g, '');
  const hay = fold(`${r.nom} ${r.prenom} ${r.prenom} ${r.nom} ${r.classe} ${r.telephone}`);
  if (query.split(/\s+/).every((word) => hay.includes(word))) return true;
  return digits.length >= 3 && r.telephone.replace(/\D/g, '').includes(digits);
}

const byName = (a, b) => a.nom.localeCompare(b.nom, 'fr') || a.prenom.localeCompare(b.prenom, 'fr');
export const SORTS = {
  recent: { label: 'Plus récentes', fn: (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id },
  ancien: { label: 'Plus anciennes', fn: (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id },
  nom: { label: 'Nom (A → Z)', fn: byName },
  classe: { label: 'Classe', fn: (a, b) => a.classe.localeCompare(b.classe, 'fr', { numeric: true }) || byName(a, b) },
};

/* ---------- Export CSV (Excel, LibreOffice, Google Sheets) ---------- */

const quote = (s) => (/[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
// Neutralise les formules (injection CSV) dans les champs saisis.
const text = (v) => quote(/^[=+\-@\t\r]/.test(String(v ?? '')) ? `'${v}` : String(v ?? ''));
// Le téléphone commence par « + » : forcé en texte pour éviter qu'Excel l'évalue.
const phone = (v) => quote(`="${String(v).replace(/[^+\d ]/g, '')}"`);

export function toCsv(rows) {
  const header = ['N°', 'Nom', 'Prénom', 'Téléphone', 'Classe', 'Date d’inscription'];
  const lines = rows.map((r) =>
    [String(r.rank), text(r.nom), text(r.prenom), phone(r.telephone), text(r.classe), formatDateTime(r.createdAt)].join(';'),
  );
  return '\uFEFF' + [header.join(';'), ...lines].join('\r\n') + '\r\n';
}
