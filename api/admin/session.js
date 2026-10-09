// GET /api/admin/session — indique si la session organisateur est ouverte.
import { isAuthenticated } from '../../server/auth.js';
import { route, send } from '../../server/http.js';

export default route(['GET'], async (req, res) => {
  send(res, 200, { ok: true, authenticated: isAuthenticated(req) });
});
