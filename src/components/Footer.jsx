import { EVENT, LOGO_SRC } from '../config.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <img src={LOGO_SRC} alt="Logo IPEST" width="360" height="295" loading="lazy" />
          <div>
            <strong>{EVENT.organizer}</strong>
            <p>{EVENT.institution}</p>
          </div>
        </div>
        <p className="site-footer__small">
          {EVENT.title} — {EVENT.dateLabel} · {EVENT.venue}
        </p>
      </div>
    </footer>
  );
}
