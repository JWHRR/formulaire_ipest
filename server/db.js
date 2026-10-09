// Accès à la base PostgreSQL.
// - Production (Vercel) : Neon via DATABASE_URL (ou POSTGRES_URL).
// - Développement local et tests : PGlite (Postgres embarqué) installé par
//   vite.config.js / les tests dans globalThis.__IPEST_DEV_DB__.
import { neon } from '@neondatabase/serverless';
import { ConfigError } from './http.js';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS registrations (
     id SERIAL PRIMARY KEY,
     nom TEXT NOT NULL,
     prenom TEXT NOT NULL,
     telephone TEXT NOT NULL,
     classe TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS registrations_telephone_key ON registrations (telephone)`,
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
