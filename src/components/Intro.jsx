import { Landmark, MapPin, Rotate3d, Footprints } from 'lucide-react';
import Reveal from './Reveal.jsx';

const HIGHLIGHTS = [
  {
    icon: Landmark,
    title: 'Dougga',
    text: 'Un parcours au cœur du site archéologique de Dougga, inscrit au patrimoine mondial de l’UNESCO.',
  },
  {
    icon: Rotate3d,
    title: 'Expérience 3D',
    text: 'Une immersion en 3D pour redécouvrir Dougga sous un nouvel angle.',
  },
  {
    icon: MapPin,
    title: 'Testour',
    text: 'La découverte de Testour, ville marquée par son héritage andalou.',
  },
  {
    icon: Footprints,
    title: 'Ain Thunga',
    text: 'Une dernière halte sur le site d’Ain Thunga avant le retour vers Tunis.',
  },
];

export default function Intro() {
  return (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">L’expérience</p>
          <h2 id="intro-title" className="section__title">Une journée pour revivre notre histoire</h2>
          <p className="section__lead">
            Le Service Socio-Culturel de l’IPEST vous invite à une sortie culturelle à la rencontre de sites
            qui racontent des siècles d’histoire tunisienne : vestiges antiques, traditions et patrimoine vivant.
          </p>
        </Reveal>

        <div className="highlights">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="article" className="card highlight" key={title} delay={i * 80}>
              <span className="highlight__icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
