// POST /api/register — enregistre une inscription.
import { sanitizeRegistration } from '../src/lib/validation.js';
import { TABLE, query } from '../server/db.js';
import { readJson, route, send } from '../server/http.js';

export default route(['POST'], async (req, res) => {
  const body = await readJson(req);
  if (body.website) return send(res, 400, { ok: false, code: 'rejected', error: 'Soumission refusée.' });

  const { data, errors } = sanitizeRegistration(body);
  if (errors) {
    return send(res, 400, { ok: false, code: 'invalid', error: Object.values(errors)[0], fields: errors });
  }

  const rows = await query(
    `INSERT INTO ${TABLE} (nom, prenom, telephone, classe, chambre, sport)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (telephone) DO NOTHING
     RETURNING id, created_at`,
    [data.nom, data.prenom, data.telephone, data.classe, data.chambre, data.sport],
  );

  if (!rows.length) {
    return send(res, 409, {
      ok: false,
      code: 'duplicate',
      error: 'Ce numéro de téléphone est déjà inscrit. Contactez le Service Socio-Culturel en cas d\u2019erreur.',
      fields: { telephone: 'Ce numéro est déjà inscrit.' },
    });
  }

  return send(res, 201, { ok: true, id: rows[0].id, createdAt: new Date(rows[0].created_at).toISOString() });
});
