// POST /api/admin/login — ouvre une session organisateur.
import { checkPassword, sessionCookie } from '../../server/auth.js';
import { query } from '../../server/db.js';
import { clientIp, readJson, route, send } from '../../server/http.js';

const MAX_FAILURES = 8; // par adresse IP sur 15 minutes

export default route(['POST'], async (req, res) => {
  const ip = clientIp(req);
  const [{ failures }] = await query(
    `SELECT count(*)::int AS failures FROM admin_login_attempts
     WHERE ip = $1 AND attempted_at > now() - interval '15 minutes'`,
    [ip],
  );
  if (failures >= MAX_FAILURES) {
    return send(res, 429, { ok: false, code: 'rate_limited', error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
  }

  const { password } = await readJson(req);
  if (!checkPassword(password)) {
    await query('INSERT INTO admin_login_attempts (ip) VALUES ($1)', [ip]);
    await query(`DELETE FROM admin_login_attempts WHERE attempted_at < now() - interval '1 day'`);
    await new Promise((r) => setTimeout(r, 400)); // ralentit les essais automatisés
    return send(res, 401, { ok: false, code: 'bad_password', error: 'Mot de passe incorrect.' });
  }

  await query('DELETE FROM admin_login_attempts WHERE ip = $1', [ip]);
  return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req) });
});
