import {
  Bus, BusFront, CalendarDays, Clock, Footprints, Landmark, MapPin, Rotate3d, Route, Users, UtensilsCrossed,
} from 'lucide-react';
import { EVENT, PROGRAM } from '../config.js';
import Reveal from './Reveal.jsx';

const ICONS = {
  bus: Bus,
  busFront: BusFront,
  landmark: Landmark,
  rotate3d: Rotate3d,
  route: Route,
  utensils: UtensilsCrossed,
  mapPin: MapPin,
  footprints: Footprints,
};

export default function Program() {
  return (
    <section className="section program" id="programme" aria-labelledby="program-title">
      <div className="container program__grid">
        <div>
          <Reveal className="section__head section__head--left">
            <p className="eyebrow">Programme</p>
            <h2 id="program-title" className="section__title">L’itinéraire de la journée</h2>
          </Reveal>

          <ol className="timeline">
            {PROGRAM.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <Reveal as="li" className="timeline__item" key={step.time} delay={i * 60}>
                  <span className="timeline__dot" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div className="timeline__card">
                    <time className="timeline__time">{step.time}</time>
                    <span className="timeline__label">{step.label}</span>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <Reveal as="aside" className="card info-card" delay={120} aria-label="Informations pratiques">
          <h3 className="info-card__title">En bref</h3>
          <dl className="info-list">
            <div>
              <dt><CalendarDays size={18} aria-hidden="true" /> Date</dt>
              <dd>{EVENT.dateLabel}</dd>
            </div>
            <div>
              <dt><Clock size={18} aria-hidden="true" /> Départ</dt>
              <dd>{EVENT.departure}</dd>
            </div>
            <div>
              <dt><Users size={18} aria-hidden="true" /> Organisation</dt>
              <dd>{EVENT.organizer}</dd>
            </div>
          </dl>
          <a className="btn btn--primary btn--block" href="#inscription">Je m’inscris</a>
        </Reveal>
      </div>
    </section>
  );
}
