// Illustrations vectorielles : raquette, balle et terrain de padel.
import { useId } from 'react';

const HOLES = [];
for (let row = 0; row < 9; row++) {
  for (let col = 0; col < 7; col++) {
    HOLES.push([42 + col * 19 + (row % 2) * 9.5, 52 + row * 19]);
  }
}

export function Racket({ className, ...rest }) {
  const uid = useId().replace(/:/g, '');
  const id = (n) => `${n}-${uid}`;
  return (
    <svg className={className} viewBox="0 0 200 370" aria-hidden="true" focusable="false" {...rest}>
      <defs>
        <linearGradient id={id('rk-face')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9a3d" />
          <stop offset="0.55" stopColor="#f26b1d" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id={id('rk-rim')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1a4a" />
          <stop offset="0.5" stopColor="#1a3ea8" />
          <stop offset="1" stopColor="#0a1a4a" />
        </linearGradient>
        <clipPath id={id('rk-clip')}>
          <path d="M100 26c48 0 74 38 74 92 0 58-34 96-62 112H88c-28-16-62-54-62-112 0-54 26-92 74-92Z" />
        </clipPath>
      </defs>
      {/* cadre */}
      <path d="M100 12c58 0 88 44 88 106 0 66-40 110-74 128H86C52 228 12 184 12 118 12 56 42 12 100 12Z" fill={`url(#${id('rk-rim')})`} />
      {/* face perforée */}
      <path d="M100 26c48 0 74 38 74 92 0 58-34 96-62 112H88c-28-16-62-54-62-112 0-54 26-92 74-92Z" fill={`url(#${id('rk-face')})`} />
      <g clipPath={`url(#${id('rk-clip')})`} fill="#0a1a4a" opacity="0.55">
        {HOLES.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4.2" />)}
      </g>
      <path d="M58 60c14-18 30-24 50-24" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* cœur et manche */}
      <path d="M86 244h28l-6 52H92Z" fill={`url(#${id('rk-rim')})`} />
      <rect x="86" y="292" width="28" height="66" rx="9" fill="#0a1a4a" />
      <g stroke="#ffb81c" strokeWidth="3" opacity="0.9">
        <line x1="88" y1="304" x2="112" y2="296" />
        <line x1="88" y1="318" x2="112" y2="310" />
        <line x1="88" y1="332" x2="112" y2="324" />
        <line x1="88" y1="346" x2="112" y2="338" />
      </g>
      <rect x="84" y="352" width="32" height="12" rx="5" fill="#ffb81c" />
    </svg>
  );
}

export function Ball({ className }) {
  const id = `ball-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#f4ff8a" />
          <stop offset="0.6" stopColor="#d4f03c" />
          <stop offset="1" stopColor="#a6c51c" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id})`} />
      <path d="M14 26c22 10 26 38 8 60M86 14c-20 14-22 46 -4 72" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/** Terrain vu en perspective, avec filet et vitres du fond. */
export function Court({ className }) {
  return (
    <svg className={className} viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="court-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f7df6" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2f7df6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="court-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <polygon points="330,60 870,60 1180,420 20,420" fill="url(#court-floor)" />
      <g stroke="url(#court-fade)" strokeWidth="4" fill="none">
        <polygon points="330,60 870,60 1180,420 20,420" />
        <line x1="268" y1="132" x2="932" y2="132" />
        <line x1="128" y1="296" x2="1072" y2="296" />
        <line x1="600" y1="132" x2="600" y2="296" />
      </g>
      {/* filet */}
      <g>
        <line x1="210" y1="200" x2="990" y2="200" stroke="#fff" strokeOpacity="0.9" strokeWidth="5" />
        <rect x="214" y="200" width="772" height="34" fill="url(#court-net)" opacity="0.5" />
        <line x1="210" y1="200" x2="210" y2="244" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" />
        <line x1="990" y1="200" x2="990" y2="244" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" />
      </g>
      <defs>
        <pattern id="court-net" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 0L12 12M12 0L0 12" stroke="#fff" strokeWidth="1" />
        </pattern>
      </defs>
      {/* vitres du fond */}
      <g stroke="#fff" strokeOpacity="0.22" strokeWidth="2">
        {[330, 420, 510, 600, 690, 780, 870].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="60" />)}
        <line x1="330" y1="0" x2="870" y2="0" />
      </g>
    </svg>
  );
}
