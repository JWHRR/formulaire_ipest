import { ArrowDown, CalendarDays, Clock, Sparkles } from 'lucide-react';
import { EVENT } from '../config.js';
import Countdown from './Countdown.jsx';
import TempleSilhouette from './TempleSilhouette.jsx';

export default function Hero({ countdown }) {
  const scrollToForm = (e) => {
    e.preventDefault();
    const target = document.getElementById('inscription');
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#inscription');
    // place le focus sur le premier champ pour la navigation clavier
    setTimeout(() => document.getElementById('nom')?.focus({ preventScroll: true }), reduce ? 0 : 650);
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__sky" aria-hidden="true">
        <span className="cloud cloud--1" />
        <span className="cloud cloud--2" />
        <span className="cloud cloud--3" />
        <span className="sun" />
      </div>

      <div className="container hero__content">
        <span className="badge badge--gold hero__badge">
          <Sparkles size={14} aria-hidden="true" /> Sortie culturelle
        </span>
        <h1 id="hero-title" className="hero__title">
          Découvrez <span className="hero__title-accent">{EVENT.title}</span>
        </h1>
        <p className="hero__subtitle">{EVENT.slogan}</p>

        <div className="hero__meta">
          <span className="chip">
            <CalendarDays size={16} aria-hidden="true" /> {EVENT.dateLabel}
          </span>
          <span className="chip">
            <Clock size={16} aria-hidden="true" /> {EVENT.departure}
          </span>
        </div>

        <div className="hero__actions">
          <a className="btn btn--primary btn--large" href="#inscription" onClick={scrollToForm}>
            S’inscrire à la sortie <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="hero__countdown">
          <Countdown countdown={countdown} variant="glass" />
        </div>
      </div>

      <TempleSilhouette className="hero__temple" />
    </section>
  );
}
