// Client de l'API organisateur (cookie de session HttpOnly, même origine).

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function call(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      credentials: 'same-origin',
      cache: 'no-store',
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  } catch {
    throw new ApiError('Connexion au serveur impossible. Vérifiez votre connexion Internet.', 0, 'network');
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignoré : traité ci-dessous
  }
  if (!res.ok || !data || data.ok !== true) {
    throw new ApiError(data?.error || 'Erreur inattendue du serveur.', res.status, data?.code);
  }
  return data;
}

export const api = {
  session: () => call('/api/admin/session'),
  login: (password) => call('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => call('/api/admin/logout', { method: 'POST' }),
  list: () => call('/api/admin/registrations'),
  remove: (id) => call(`/api/admin/registrations?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
