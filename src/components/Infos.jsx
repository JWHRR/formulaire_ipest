import { BadgeCheck, CalendarDays, GraduationCap, MapPin, Music, PartyPopper, Ticket } from 'lucide-react';
import { EVENT, PERKS, POSTER_SRC } from '../config.js';
import { Racket } from './PadelArt.jsx';
import Reveal from './Reveal.jsx';

const RacketIcon = ({ size = 24 }) => <Racket className="perk__racket" style={{ height: size }} />;
const PERK_ICONS = { racket: RacketIcon, ticket: Ticket, party: PartyPopper, music: Music };

const FACTS = [
  { icon: CalendarDays, label: 'Quand', value: EVENT.dateLabel, detail: EVENT.timeLabel },
  { icon: MapPin, label: 'Lieu', value: EVENT.venue },
  { icon: BadgeCheck, label: 'Coach certifiée', value: EVENT.coach },
  { icon: GraduationCap, label: 'Pour qui ?', value: EVENT.audience },
];

export default function Infos() {
  return (
    <>
      <div className="ribbon" aria-hidden="true">
        <span>{EVENT.tagline}</span>
      </div>

      <section className="section infos" id="infos" aria-labelledby="infos-title">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">L’essentiel</p>
            <h2 id="infos-title" className="section__title">Tout savoir sur la journée</h2>
            <p className="section__lead">
              Une après-midi pour s’initier au padel avec une coach certifiée, dans une ambiance festive.
              Aucun matériel à prévoir : les raquettes sont fournies et l’entrée est gratuite.
            </p>
          </Reveal>

          <div className="infos__grid">
            <div className="facts">
              {FACTS.map(({ icon: Icon, label, value, detail }, i) => (
                <Reveal as="article" className="card fact" key={label} delay={i * 70}>
                  <span className="fact__icon" aria-hidden="true"><Icon size={22} /></span>
                  <h3 className="fact__label">{label}</h3>
                  <p className="fact__value">{value}</p>
                  {detail && <p className="fact__detail">{detail}</p>}
                </Reveal>
              ))}
            </div>

            <Reveal as="figure" className="poster" delay={120}>
              <a href={POSTER_SRC} target="_blank" rel="noopener" className="poster__link">
                <img
                  src={POSTER_SRC} width="900" height="1159" loading="lazy" decoding="async"
                  alt={`Affiche officielle : ${EVENT.title}, ${EVENT.dateLabel}, ${EVENT.venue}`}
                />
              </a>
              <figcaption>Affiche officielle — touchez pour agrandir</figcaption>
            </Reveal>
          </div>

          <Reveal as="ul" className="perks" aria-label="Sur place">
            {PERKS.map(({ icon, label }) => {
              const Icon = PERK_ICONS[icon];
              return (
                <li className="perk" key={label}>
                  <span className="perk__icon" aria-hidden="true"><Icon size={24} /></span>
                  <span className="perk__label">{label}</span>
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>
    </>
  );
}
