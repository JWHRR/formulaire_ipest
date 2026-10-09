import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { api } from './api.js';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';

export default function AdminApp() {
  const [auth, setAuth] = useState('checking'); // checking | out | in
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api.session()
      .then((d) => setAuth(d.authenticated ? 'in' : 'out'))
      .catch((err) => {
        setNotice(err.message);
        setAuth('out');
      });
  }, []);

  const onExpired = useCallback((message) => {
    setNotice(message || 'Votre session a expiré. Veuillez vous reconnecter.');
    setAuth('out');
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setNotice('Vous êtes déconnecté.');
      setAuth('out');
    }
  }, []);

  if (auth === 'checking') {
    return (
      <div className="admin-loading" role="status">
        <LoaderCircle className="spin" size={28} aria-hidden="true" />
        <span>Chargement…</span>
      </div>
    );
  }

  if (auth === 'out') {
    return <Login notice={notice} onSuccess={() => { setNotice(null); setAuth('in'); }} />;
  }

  return <Dashboard onExpired={onExpired} onLogout={logout} />;
}
