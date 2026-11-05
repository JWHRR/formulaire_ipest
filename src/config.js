// Toutes les informations de l'événement sont centralisées ici.
// Elles reprennent exactement l'affiche officielle de l'événement.
// Module pur : également importé par l'API (dossier api/).

export const EVENT = {
  organizer: 'Service Socio-Culturel de l’IPEST',
  institution: 'Institut Préparatoire aux Études Scientifiques et Techniques',
  institutionShort: 'IPEST',
  title: 'Journée Porte Ouverte Ping Pong et Badminton',
  kicker: 'Journée porte ouverte',
  sports: ['Ping Pong', 'et Badminton'],
  slogan: 'Jouez • Partagez • Dépassez-vous !',
  dateLabel: 'Mercredi 11 novembre 2026',
  timeLabel: 'L’après-midi',
  venue: 'Salle de sport de l’IPEST',
  venueIn: 'à la salle de sport de l’IPEST',
  equipment: 'Raquettes, volants, balles',
};

export const PERKS = [
  { icon: 'paddle', label: 'Matériel fourni', detail: '(raquettes, volants, balles)' },
  { icon: 'party', label: 'Ambiance festive' },
  { icon: 'key', label: 'Inscription obligatoire' },
];

// Affiche officielle (dans /public).
export const POSTER_SRC = '/affiche-ping-pong-badminton.jpg';

// Clôture des inscriptions : lundi 9 novembre 2026 à minuit (heure de Tunis, UTC+1).
// « Minuit le 9 » = fin de la journée du 9, soit le 10 novembre à 00:00.
// Appliquée à la fois sur le site et par l'API.
export const DEADLINE_ISO = '2026-11-10T00:00:00+01:00';
export const DEADLINE_LABEL = 'Lundi 9 novembre 2026 à minuit';

// Liste des classes proposées dans un menu déroulant.
// Vide : le champ « Classe » est une saisie libre.
// Renseignée (ex. ['…', '…']) : menu déroulant + option « Autre (préciser) ».
export const CLASS_OPTIONS = [];

// Chemin d'un logo officiel placé dans /public (ex. '/logo-ipest.png').
// Laisser null pour afficher le monogramme typographique.
export const LOGO_SRC = '/logo-ipest.png';
