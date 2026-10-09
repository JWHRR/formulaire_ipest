import { EVENT, LOGO_SRC } from '../config.js';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label={`${EVENT.institutionShort} — ${EVENT.organizer}`}>
          {LOGO_SRC ? (
            <img className="brand__logo" src={LOGO_SRC} alt="Logo IPEST" width="360" height="295" />
          ) : (
            <span className="brand__mark" aria-hidden="true">IPEST</span>
          )}
          <span className="brand__text">
            <strong>Service Socio-Culturel</strong>
          </span>
        </a>
        <a className="btn btn--small btn--ghost" href="#inscription">S’inscrire</a>
      </div>
    </header>
  );
}
