// Accès à la base PostgreSQL.
// - Production (Vercel) : Neon via DATABASE_URL (ou POSTGRES_URL).
// - Développement local et tests : PGlite (Postgres embarqué) installé par
//   vite.config.js / les tests dans globalThis.__IPEST_DEV_DB__.
import { neon } from '@neondatabase/serverless';
import { ConfigError } from './http.js';

export const TABLE = 'sport_registrations';

const SCHEMA = [
  // Suppression définitive des inscriptions des anciens événements (sortie Dougga & Testour,
  // journée padel), demandée par l'organisateur. Sans effet une fois les tables supprimées.
  `DROP TABLE IF EXISTS registrations`,
  `DROP TABLE IF EXISTS padel_registrations`,
  `CREATE TABLE IF NOT EXISTS ${TABLE} (
     id SERIAL PRIMARY KEY,
     nom TEXT NOT NULL,
     prenom TEXT NOT NULL,
     telephone TEXT NOT NULL,
     classe TEXT NOT NULL,
     chambre TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Choix du sport, ajouté après l'ouverture des inscriptions : les inscriptions
  // déjà reçues sont conservées (sport vide = non précisé).
  `ALTER TABLE ${TABLE} ADD COLUMN IF NOT EXISTS sport TEXT`,
  // Ancien choix « Les deux » (avant l'ajout du fitness) = ping-pong + badminton.
  `UPDATE ${TABLE} SET sport = 'ping-pong,badminton' WHERE sport = 'les-deux'`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ${TABLE}_telephone_key ON ${TABLE} (telephone)`,
  `CREATE TABLE IF NOT EXISTS admin_login_attempts (
     id SERIAL PRIMARY KEY,
     ip TEXT NOT NULL,
     attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_idx ON admin_login_attempts (ip, attempted_at)`,
];

let client = null;
let ready = null;

function getClient() {
  if (globalThis.__IPEST_DEV_DB__) return globalThis.__IPEST_DEV_DB__;
  if (!client) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new ConfigError('La base de données n’est pas configurée (variable DATABASE_URL manquante).');
    const sql = neon(url);
    client = { query: (text, params = []) => sql.query(text, params) };
  }
  return client;
}

/** Exécute une requête paramétrée et renvoie les lignes. Crée le schéma au premier appel. */
export async function query(text, params = []) {
  const db = getClient();
  if (!ready) {
    ready = (async () => {
      for (const statement of SCHEMA) await db.query(statement);
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  await ready;
  return db.query(text, params);
}

/** Réservé aux tests : oublie le schéma déjà initialisé. */
export function resetDbForTests() {
  ready = null;
  client = null;
}
