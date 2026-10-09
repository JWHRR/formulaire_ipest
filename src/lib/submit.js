// Envoi d'une inscription à l'API du site (/api/register).
// Un succès n'est déclaré QUE si le serveur répond { ok: true } après
// l'enregistrement effectif en base de données.

export class SubmissionError extends Error {
  constructor(message, { code = 'unknown', retryable = true, fields } = {}) {
    super(message);
    this.code = code;
    this.retryable = retryable;
    this.fields = fields;
  }
}

const FINAL_CODES = new Set(['closed', 'duplicate', 'invalid']);

export async function submitRegistration(payload, { endpoint = '/api/register', fetchImpl = fetch, timeoutMs = 20000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new SubmissionError('Le serveur met trop de temps à répondre. Vérifiez votre connexion puis réessayez.', { code: 'timeout' });
    }
    throw new SubmissionError('Impossible de joindre le serveur. Vérifiez votre connexion Internet puis réessayez.', { code: 'network' });
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // réponse non JSON : traitée ci-dessous comme un échec
  }

  if (response.ok && data && data.ok === true) return data;

  if (data && data.ok === false && data.error) {
    throw new SubmissionError(data.error, { code: data.code || 'rejected', retryable: !FINAL_CODES.has(data.code), fields: data.fields });
  }

  throw new SubmissionError('Votre inscription n’a pas pu être confirmée par le serveur. Merci de réessayer dans un instant.', { code: 'bad_response' });
}
