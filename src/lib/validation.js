// Validation et normalisation des inscriptions.
// Module pur, partagé par le formulaire (navigateur) et l'API (serveur).

export const OTHER_CLASS = '__other__';

const NAME_RE = /^\p{L}[\p{L}\p{M}' .-]*$/u;
const CLASS_RE = /^[\p{L}\p{N}][\p{L}\p{M}\p{N}' .()/+-]*$/u;

const collapse = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');

/**
 * Normalise un numéro tunisien. Accepte : 8 chiffres, +216, 00216 ou 216,
 * avec espaces, points, tirets ou parenthèses.
 * Retourne « +216 XX XXX XXX » ou null si le numéro est invalide.
 */
export function normalizeTunisianPhone(raw) {
  const compact = String(raw ?? '').replace(/[\s.\-()]/g, '');
  const match = compact.match(/^(?:\+216|00216|216)?([2-9]\d{7})$/);
  if (!match) return null;
  const d = match[1];
  return `+216 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
}

/** NOM en majuscules, Prénom avec initiales en majuscule (y compris après un tiret). */
export const formatNom = (s) => collapse(s).toLocaleUpperCase('fr');
export const formatPrenom = (s) =>
  collapse(s)
    .toLocaleLowerCase('fr')
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase('fr'));

function nameError(value, label) {
  const v = collapse(value);
  if (!v) return `Veuillez indiquer votre ${label}.`;
  if (v.length < 2) return `Votre ${label} semble trop court.`;
  if (v.length > 60) return `Votre ${label} ne doit pas dépasser 60 caractères.`;
  if (!NAME_RE.test(v)) return `Votre ${label} ne doit contenir que des lettres, espaces, tirets ou apostrophes.`;
  return undefined;
}

function classError(value) {
  const v = collapse(value);
  if (!v) return 'Veuillez indiquer votre classe.';
  if (v.length > 40) return 'La classe ne doit pas dépasser 40 caractères.';
  if (!CLASS_RE.test(v)) return 'Cette classe contient des caractères non autorisés.';
  return undefined;
}

/** Classe en majuscules pour regrouper « mp1 » et « MP1 ». */
export const formatClasse = (s) => collapse(s).toLocaleUpperCase('fr');

/** Validation des 4 champs, une fois la classe déterminée. */
export function validateFields({ nom, prenom, telephone, classe }) {
  const errors = {};
  const e1 = nameError(nom, 'nom');
  const e2 = nameError(prenom, 'prénom');
  if (e1) errors.nom = e1;
  if (e2) errors.prenom = e2;

  if (!String(telephone ?? '').trim()) errors.telephone = 'Veuillez indiquer votre numéro de téléphone.';
  else if (!normalizeTunisianPhone(telephone))
    errors.telephone = 'Numéro invalide : saisissez un numéro tunisien à 8 chiffres, avec ou sans +216.';

  const e3 = classError(classe);
  if (e3) errors.classe = e3;
  return errors;
}

/* ---------- Côté formulaire ---------- */

export function resolveClass(values) {
  return values.classe === OTHER_CLASS ? values.classeAutre : values.classe;
}

export function validateRegistration(values) {
  const errors = validateFields({ ...values, classe: resolveClass(values) });
  // Avec une liste déroulante, l'erreur « autre » s'affiche sous le champ libre.
  if (errors.classe && values.classe === OTHER_CLASS && values.withSelect) {
    errors.classeAutre = errors.classe;
    delete errors.classe;
  } else if (errors.classe && values.withSelect && !values.classe) {
    errors.classe = 'Veuillez sélectionner votre classe.';
  }
  return errors;
}

export function buildPayload(values) {
  return {
    nom: collapse(values.nom),
    prenom: collapse(values.prenom),
    telephone: values.telephone,
    classe: collapse(resolveClass(values)),
    website: values.website || '', // champ piège anti-robot, doit rester vide
  };
}

/* ---------- Côté serveur ---------- */

/** Valide et normalise une charge utile reçue par l'API. */
export function sanitizeRegistration(body) {
  const input = body && typeof body === 'object' ? body : {};
  const str = (k) => (typeof input[k] === 'string' ? input[k] : '');
  const raw = { nom: str('nom'), prenom: str('prenom'), telephone: str('telephone'), classe: str('classe') };
  const errors = validateFields(raw);
  if (Object.keys(errors).length) return { errors };
  return {
    data: {
      nom: formatNom(raw.nom),
      prenom: formatPrenom(raw.prenom),
      telephone: normalizeTunisianPhone(raw.telephone),
      classe: formatClasse(raw.classe),
    },
  };
}
