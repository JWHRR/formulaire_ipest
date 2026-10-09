// POST /api/admin/logout — ferme la session organisateur.
import { clearedCookie } from '../../server/auth.js';
import { route, send } from '../../server/http.js';

export default route(['POST'], async (req, res) => {
  send(res, 200, { ok: true }, { 'Set-Cookie': clearedCookie(req) });
});
