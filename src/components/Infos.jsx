import { CalendarDays, ClipboardCheck, KeyRound, MapPin, PartyPopper } from 'lucide-react';
import { DEADLINE_LABEL, EVENT, PERKS, POSTER_SRC } from '../config.js';
import { Paddle } from './SportArt.jsx';
import Reveal from './Reveal.jsx';

const PaddleIcon = ({ size = 24 }) => <Paddle className="perk__racket" style={{ height: size }} />;
const PERK_ICONS = { paddle: PaddleIcon, party: PartyPopper, key: KeyRound };

const FACTS = [
  { icon: CalendarDays, label: 'Quand', value: EVENT.dateLabel, detail: EVENT.timeLabel },
  { icon: MapPin, label: 'Lieu', value: EVENT.venue },
  { icon: PaddleIcon, label: 'Matériel fourni', value: EVENT.equipment },
  { icon: ClipboardCheck, label: 'Inscription obligatoire', value: `Avant le ${DEADLINE_LABEL.toLowerCase()}` },
];

export default function Infos() {
  return (
    <>
      <div className="ribbon" aria-hidden="true">
        <span>Ping Pong • Badminton • Fitness</span>
      </div>

      <section className="section infos" id="infos" aria-labelledby="infos-title">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">L’essentiel</p>
            <h2 id="infos-title" className="section__title">Tout savoir sur la journée</h2>
            <p className="section__lead">
              Un après-midi de ping-pong, de badminton et de fitness {EVENT.venueIn}, dans une ambiance festive.
              Aucun matériel à prévoir : raquettes, volants et balles sont fournis. Jouez, partagez, dépassez-vous !
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
                  src={POSTER_SRC} width="900" height="1272" loading="lazy" decoding="async"
                  alt={`Affiche officielle : ${EVENT.title}, ${EVENT.dateLabel}, ${EVENT.venue}`}
                />
              </a>
              <figcaption>Affiche officielle — touchez pour agrandir</figcaption>
            </Reveal>
          </div>

          <Reveal as="ul" className="perks" aria-label="Sur place">
            {PERKS.map(({ icon, label, detail }) => {
              const Icon = PERK_ICONS[icon];
              return (
                <li className="perk" key={label}>
                  <span className="perk__icon" aria-hidden="true"><Icon size={24} /></span>
                  <span className="perk__label">{label}</span>
                  {detail && <span className="perk__detail">{detail}</span>}
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>
    </>
  );
}
