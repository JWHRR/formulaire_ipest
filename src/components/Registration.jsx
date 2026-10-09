import { useRef, useState } from 'react';
import {
  CircleAlert, CircleCheckBig, GraduationCap, IdCard, LoaderCircle, Lock, Phone, RefreshCw, Send, User,
} from 'lucide-react';
import { CLASS_OPTIONS, EVENT } from '../config.js';
import { OTHER_CLASS, buildPayload, normalizeTunisianPhone, validateRegistration } from '../lib/validation.js';
import { submitRegistration } from '../lib/submit.js';
import Countdown from './Countdown.jsx';
import Field from './Field.jsx';
import Reveal from './Reveal.jsx';

const WITH_SELECT = CLASS_OPTIONS.length > 0;
const EMPTY = { nom: '', prenom: '', telephone: '', classe: '', classeAutre: '', website: '', withSelect: WITH_SELECT };
const FIELD_ORDER = ['nom', 'prenom', 'telephone', 'classe', 'classeAutre'];

export default function Registration({ countdown }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);
  const submittingRef = useRef(false);
  const formRef = useRef(null);
  const successRef = useRef(null);

  const update = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (touched[name] || errors[name]) {
      const all = validateRegistration(next);
      setErrors((prev) => ({ ...prev, [name]: all[name], ...(name === 'classe' ? { classeAutre: undefined } : {}) }));
    }
  };

  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateRegistration(values)[name] }));
    if (name === 'telephone') {
      const normalized = normalizeTunisianPhone(values.telephone);
      if (normalized) setValues((v) => ({ ...v, telephone: normalized }));
    }
  };

  const focusField = (name) => formRef.current?.querySelector(`[name="${name}"]`)?.focus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current || countdown.closed) return;

    const found = validateRegistration(values);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) return focusField(first);

    // Ferme le clavier sur mobile pendant l'envoi.
    document.activeElement?.blur?.();
    submittingRef.current = true;
    setStatus('submitting');
    setServerError(null);
    try {
      await submitRegistration(buildPayload(values));
      setStatus('success');
      setValues(EMPTY);
      setTouched({});
      setErrors({});
      requestAnimationFrame(() => {
        successRef.current?.focus({ preventScroll: true });
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch (err) {
      setServerError(err);
      setStatus('error');
      if (err.fields) {
        setErrors((prev) => ({ ...prev, ...err.fields }));
        const firstServer = FIELD_ORDER.find((f) => err.fields[f]);
        if (firstServer) requestAnimationFrame(() => focusField(firstServer));
      }
    } finally {
      submittingRef.current = false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setServerError(null);
    requestAnimationFrame(() => document.getElementById('nom')?.focus());
  };

  const submitting = status === 'submitting';
  const err = (name) => touched[name] && errors[name];
  const common = (name) => ({ id: name, name, value: values[name], onChange: update(name), onBlur: blur(name), disabled: submitting });

  return (
    <section className="section registration" id="inscription" aria-labelledby="registration-title">
      <div className="container registration__grid">
        <Reveal className="registration__aside">
          <p className="eyebrow eyebrow--light">Inscription</p>
          <h2 id="registration-title" className="section__title section__title--light">Réservez votre place</h2>
          <p className="registration__lead">
            Quatre informations suffisent pour vous inscrire à la sortie {EVENT.title} du {EVENT.dateLabel.toLowerCase()}.
          </p>
          <Countdown countdown={countdown} variant="dark" />
          <p className="registration__note">
            Tous les champs sont obligatoires. Vos informations sont utilisées uniquement par le Service
            Socio-Culturel pour l’organisation de cette sortie.
          </p>
        </Reveal>

        <Reveal className="card form-card" delay={100}>
          {status === 'success' ? (
            <div className="success" role="status" tabIndex={-1} ref={successRef}>
              <span className="success__icon" aria-hidden="true"><CircleCheckBig size={40} /></span>
              <h3>Inscription enregistrée !</h3>
              <p>
                Merci pour votre intérêt pour la sortie culturelle Dougga &amp; Testour organisée par le Service
                Socio-Culturel de l’IPEST. Votre réponse a bien été prise en compte.
              </p>
              <button type="button" className="btn btn--ghost" onClick={reset}>Inscrire une autre personne</button>
            </div>
          ) : countdown.closed ? (
            <div className="closed">
              <span className="closed__icon" aria-hidden="true"><Lock size={32} /></span>
              <h3>Inscriptions closes</h3>
              <p>La période d’inscription à la sortie {EVENT.title} est terminée. Merci de votre intérêt.</p>
            </div>
          ) : (
            <form ref={formRef} className="form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
              <div className="form__header">
                <h3>Formulaire d’inscription</h3>
                <p>Sortie {EVENT.title} — {EVENT.dateLabel}</p>
              </div>

              <div className="form__row">
                <Field id="nom" label="Nom" required icon={User} error={err('nom')}>
                  {(a11y) => (
                    <input {...common('nom')} {...a11y} type="text" autoComplete="family-name" autoCapitalize="characters"
                      maxLength={60} placeholder="Ex. : Ben Salah" enterKeyHint="next" />
                  )}
                </Field>
                <Field id="prenom" label="Prénom" required icon={IdCard} error={err('prenom')}>
                  {(a11y) => (
                    <input {...common('prenom')} {...a11y} type="text" autoComplete="given-name" autoCapitalize="words"
                      maxLength={60} placeholder="Ex. : Amine" enterKeyHint="next" />
                  )}
                </Field>
              </div>

              <Field id="telephone" label="Numéro de téléphone" required icon={Phone}
                hint="Numéro tunisien à 8 chiffres, avec ou sans +216." error={err('telephone')}>
                {(a11y) => (
                  <input {...common('telephone')} {...a11y} type="tel" autoComplete="tel" inputMode="tel"
                    maxLength={20} placeholder="XX XXX XXX" enterKeyHint="next" />
                )}
              </Field>

              {WITH_SELECT ? (
                <>
                  <Field id="classe" label="Classe" required icon={GraduationCap} error={err('classe')}>
                    {(a11y) => (
                      <select {...common('classe')} {...a11y}>
                        <option value="" disabled>Sélectionnez votre classe</option>
                        {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option value={OTHER_CLASS}>Autre — je précise ma classe</option>
                      </select>
                    )}
                  </Field>
                  {values.classe === OTHER_CLASS && (
                    <Field id="classeAutre" label="Précisez votre classe" required error={err('classeAutre')}>
                      {(a11y) => (
                        <input {...common('classeAutre')} {...a11y} type="text" maxLength={40}
                          placeholder="Votre classe" enterKeyHint="send" />
                      )}
                    </Field>
                  )}
                </>
              ) : (
                <Field id="classe" label="Classe" required icon={GraduationCap}
                  hint="Indiquez votre classe telle qu’elle figure sur votre emploi du temps." error={err('classe')}>
                  {(a11y) => (
                    <input {...common('classe')} {...a11y} type="text" autoCapitalize="characters" autoComplete="off"
                      maxLength={40} placeholder="Votre classe" enterKeyHint="send" />
                  )}
                </Field>
              )}

              {/* Champ piège anti-robot, invisible pour les utilisateurs */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
              </div>

              {status === 'error' && serverError && (
                <div className="alert" role="alert">
                  <CircleAlert size={20} aria-hidden="true" />
                  <div>
                    <strong>L’inscription n’a pas été enregistrée.</strong>
                    <p>{serverError.message}</p>
                    {serverError.retryable && <p className="alert__retry">Vos réponses sont conservées : vous pouvez réessayer.</p>}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--large btn--block" disabled={submitting}>
                {submitting ? (
                  <><LoaderCircle className="spin" size={20} aria-hidden="true" /> Envoi en cours…</>
                ) : status === 'error' && serverError?.retryable ? (
                  <><RefreshCw size={18} aria-hidden="true" /> Réessayer l’envoi</>
                ) : (
                  <><Send size={18} aria-hidden="true" /> Valider mon inscription</>
                )}
              </button>
              <p className="sr-only" aria-live="polite">{submitting ? 'Envoi de votre inscription en cours.' : ''}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
