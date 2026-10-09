import { EVENT } from '../config.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <strong>{EVENT.organizer}</strong>
          <p>{EVENT.institution}</p>
        </div>
        <p className="site-footer__small">
          Sortie culturelle {EVENT.title} — {EVENT.dateLabel}
        </p>
      </div>
    </footer>
  );
}
