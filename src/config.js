// Toutes les informations de l'événement sont centralisées ici.
// Elles reprennent exactement l'affiche officielle de l'événement.
// Module pur : également importé par l'API (dossier api/).

export const EVENT = {
  organizer: 'Service Socio-Culturel de l’IPEST',
  institution: 'Institut Préparatoire aux Études Scientifiques et Techniques',
  institutionShort: 'IPEST',
  title: 'Journée Porte Ouverte Padel',
  kicker: 'Journée porte ouverte',
  sport: 'Padel',
  slogan: 'Plus qu’un jeu, un style de vie !',
  tagline: 'Découvrez votre nouvelle passion !',
  audience: 'Étudiants des établissements de l’Université de Carthage',
  dateLabel: 'Mercredi 4 novembre 2026',
  timeLabel: 'À partir de 12h – 15h',
  venue: 'Padelite Tunisia – Lac 3',
  coach: 'Madame Sonia Azzouz',
};

export const PERKS = [
  { icon: 'racket', label: 'Raquettes fournies' },
  { icon: 'ticket', label: 'Entrée gratuite' },
  { icon: 'party', label: 'Ambiance festive' },
  { icon: 'music', label: 'DJ Set' },
];

// Affiche officielle (dans /public).
export const POSTER_SRC = '/affiche-padel.jpg';

// Clôture des inscriptions : lundi 2 novembre 2026 à minuit (heure de Tunis, UTC+1).
// « Minuit le 2 » = fin de la journée du 2, soit le 3 novembre à 00:00.
// Appliquée à la fois sur le site et par l'API.
export const DEADLINE_ISO = '2026-11-03T00:00:00+01:00';
export const DEADLINE_LABEL = 'Lundi 2 novembre 2026 à minuit';

// Liste des classes proposées dans un menu déroulant.
// Vide : le champ « Classe » est une saisie libre.
// Renseignée (ex. ['…', '…']) : menu déroulant + option « Autre (préciser) ».
export const CLASS_OPTIONS = [];

// Chemin d'un logo officiel placé dans /public (ex. '/logo-ipest.png').
// Laisser null pour afficher le monogramme typographique.
export const LOGO_SRC = '/logo-ipest.png';
