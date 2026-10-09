// Petits utilitaires HTTP compatibles Vercel (Node) et serveur de dev Vite.

export class ConfigError extends Error {}
export class BadRequest extends Error {}

const MAX_BODY = 10 * 1024;

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export async function readJson(req) {
  // Vercel fournit déjà req.body (getter qui peut lever une erreur si le JSON est invalide).
  let body;
  try {
    body = req.body;
  } catch {
    throw new BadRequest('Requête invalide.');
  }
  if (body !== undefined && body !== null) {
    if (typeof body === 'object' && !Buffer.isBuffer(body)) return body;
    body = String(body);
  } else {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
        if (data.length > MAX_BODY) reject(new BadRequest('Requête trop volumineuse.'));
      });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  }
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw new BadRequest('Requête invalide.');
  }
}

export function queryParams(req) {
  return new URL(req.url || '/', 'http://localhost').searchParams;
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

/** Enveloppe un gestionnaire : contrôle de méthode + erreurs propres et en français. */
export function route(methods, fn) {
  return async function handler(req, res) {
    if (!methods.includes(req.method)) {
      return send(res, 405, { ok: false, code: 'method', error: 'Méthode non autorisée.' }, { Allow: methods.join(', ') });
    }
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof BadRequest) return send(res, 400, { ok: false, code: 'bad_request', error: err.message });
      if (err instanceof ConfigError) {
        console.error('[config]', err.message);
        return send(res, 503, { ok: false, code: 'not_configured', error: 'Le service n’est pas encore configuré. Merci de réessayer plus tard.' });
      }
      console.error(err);
      return send(res, 500, { ok: false, code: 'server', error: 'Erreur du serveur. Merci de réessayer dans un instant.' });
    }
  };
}
