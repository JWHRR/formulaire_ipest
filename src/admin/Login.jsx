import { useRef, useState } from 'react';
import { ArrowLeft, CircleAlert, Eye, EyeOff, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { EVENT } from '../config.js';
import { api } from './api.js';

export default function Login({ notice, onSuccess }) {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!password) {
      setError('Veuillez saisir le mot de passe.');
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.login(password);
      onSuccess();
    } catch (err) {
      setError(err.message);
      setPassword('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login">
      <div className="login__card card">
        <span className="login__icon" aria-hidden="true"><ShieldCheck size={30} /></span>
        <p className="eyebrow">Espace organisateur</p>
        <h1 className="login__title">{EVENT.title}</h1>
        <p className="login__sub">{EVENT.organizer}</p>

        {notice && !error && <p className="login__notice" role="status">{notice}</p>}

        <form className="form" onSubmit={submit} noValidate>
          <div className={`field ${error ? 'field--error' : ''}`}>
            <label className="field__label" htmlFor="password">Mot de passe</label>
            <div className="field__control field__control--icon">
              <KeyRound className="field__icon" size={18} aria-hidden="true" />
              <input
                ref={inputRef} id="password" name="password" type={visible ? 'text' : 'password'}
                autoComplete="current-password" autoFocus value={password}
                onChange={(e) => setPassword(e.target.value)} disabled={loading}
                aria-invalid={error ? true : undefined} aria-describedby={error ? 'password-error' : undefined}
              />
              <button
                type="button" className="pw-toggle" onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={visible}
              >
                {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {error && (
              <p className="field__error" id="password-error" role="alert">
                <CircleAlert size={15} aria-hidden="true" /> {error}
              </p>
            )}
          </div>
          <button type="submit" className="btn btn--primary btn--large btn--block" disabled={loading}>
            {loading ? <><LoaderCircle className="spin" size={20} aria-hidden="true" /> Connexion…</> : 'Se connecter'}
          </button>
        </form>

        <a className="login__back" href="/"><ArrowLeft size={16} aria-hidden="true" /> Retour au site</a>
      </div>
    </main>
  );
}
