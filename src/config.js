// Toutes les informations de l'événement sont centralisées ici.
// Elles reprennent exactement l'affiche officielle de la sortie.
// Module pur : également importé par l'API (dossier api/).

export const EVENT = {
  organizer: 'Service Socio-Culturel de l’IPEST',
  institution: 'Institut Préparatoire aux Études Scientifiques et Techniques',
  institutionShort: 'IPEST',
  title: 'Dougga & Testour',
  slogan: 'Sur les traces de notre patrimoine',
  dateLabel: 'Jeudi 15 octobre 2026',
  departure: '08:00 — Départ de Tunis',
};

// Clôture des inscriptions : lundi 12 octobre 2026 à minuit (heure de Tunis, UTC+1).
// « Minuit le 12 » = fin de la journée du 12, soit le 13 octobre à 00:00.
// Appliquée à la fois sur le site et par l'API.
export const DEADLINE_ISO = '2026-10-13T00:00:00+01:00';
export const DEADLINE_LABEL = 'Lundi 12 octobre 2026 à minuit';

export const PROGRAM = [
  { time: '08:00', label: 'Départ de Tunis', icon: 'bus' },
  { time: '10:00', label: 'Visite du site archéologique de Dougga', icon: 'landmark' },
  { time: '11:00', label: 'Expérience 3D Dougga', icon: 'rotate3d' },
  { time: '12:00', label: 'Départ vers Testour', icon: 'route' },
  { time: '13:00', label: 'Déjeuner et temps libre', icon: 'utensils' },
  { time: '14:00', label: 'Visite de Testour', icon: 'mapPin' },
  { time: '16:00', label: 'Visite Ain Thunga', icon: 'footprints' },
  { time: '17:00', label: 'Départ vers Tunis', icon: 'busFront' },
];

// Liste des classes proposées dans un menu déroulant.
// Vide : le champ « Classe » est une saisie libre.
// Renseignée (ex. ['…', '…']) : menu déroulant + option « Autre (préciser) ».
export const CLASS_OPTIONS = [];

// Chemin d'un logo officiel placé dans /public (ex. '/logo-ipest.png').
// Laisser null pour afficher le monogramme typographique.
export const LOGO_SRC = null;
