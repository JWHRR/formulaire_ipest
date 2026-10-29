import { ArrowDown, CalendarDays, Clock, GraduationCap, MapPin } from 'lucide-react';
import { EVENT } from '../config.js';
import Countdown from './Countdown.jsx';
import { Ball, Court, Racket } from './PadelArt.jsx';

export function scrollToForm(e) {
  e?.preventDefault();
  const target = document.getElementById('inscription');
  if (!target) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', '#inscription');
  // place le focus sur le premier champ pour la navigation clavier
  setTimeout(() => document.getElementById('nom')?.focus({ preventScroll: true }), reduce ? 0 : 650);
}

export default function Hero({ countdown }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <Court className="hero__court" />
      <span className="hero__glow" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__content">
          <p className="hero__audience">
            <GraduationCap size={18} aria-hidden="true" /> {EVENT.audience}
          </p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__kicker">{EVENT.kicker}</span>
            <span className="hero__sport">{EVENT.sport}</span>
          </h1>

          <p className="slash-banner"><span>“{EVENT.slogan}”</span></p>

          <ul className="hero__meta" aria-label="Informations pratiques">
            <li><CalendarDays size={18} aria-hidden="true" /> {EVENT.dateLabel}</li>
            <li><Clock size={18} aria-hidden="true" /> {EVENT.timeLabel}</li>
            <li><MapPin size={18} aria-hidden="true" /> {EVENT.venue}</li>
          </ul>

          <div className="hero__actions">
            <a className="btn btn--primary btn--large" href="#inscription" onClick={scrollToForm}>
              Je m’inscris <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a className="btn btn--outline btn--large" href="#infos">Voir les infos</a>
          </div>

          <div className="hero__countdown">
            <Countdown countdown={countdown} />
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <span className="hero__ring" />
          <Racket className="hero__racket" />
          <Ball className="hero__ball" />
        </div>
      </div>
    </section>
  );
}
