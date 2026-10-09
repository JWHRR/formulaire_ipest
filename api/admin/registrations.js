// GET    /api/admin/registrations         — liste des inscriptions
// DELETE /api/admin/registrations?id=123  — supprime une inscription
import { requireAdmin } from '../../server/auth.js';
import { query } from '../../server/db.js';
import { queryParams, route, send } from '../../server/http.js';

export default route(['GET', 'DELETE'], async (req, res) => {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'DELETE') {
    const id = Number(queryParams(req).get('id'));
    if (!Number.isInteger(id) || id <= 0) return send(res, 400, { ok: false, code: 'bad_request', error: 'Identifiant invalide.' });
    const rows = await query('DELETE FROM registrations WHERE id = $1 RETURNING id', [id]);
    if (!rows.length) return send(res, 404, { ok: false, code: 'not_found', error: 'Cette inscription n\u2019existe plus.' });
    return send(res, 200, { ok: true });
  }

  const rows = await query(
    'SELECT id, nom, prenom, telephone, classe, created_at FROM registrations ORDER BY created_at ASC, id ASC',
  );
  const registrations = rows.map((r) => ({
    id: r.id,
    nom: r.nom,
    prenom: r.prenom,
    telephone: r.telephone,
    classe: r.classe,
    createdAt: new Date(r.created_at).toISOString(),
  }));
  return send(res, 200, { ok: true, registrations, serverTime: new Date().toISOString() });
});
