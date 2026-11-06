// Illustrations vectorielles : raquette de ping-pong, volant, haltère, balle et terrain de badminton.
import { useId } from 'react';

export function Paddle({ className, ...rest }) {
  const uid = useId().replace(/:/g, '');
  const id = (n) => `${n}-${uid}`;
  return (
    <svg className={className} viewBox="0 0 200 350" aria-hidden="true" focusable="false" {...rest}>
      <defs>
        <radialGradient id={id('pd-rubber')} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff5a4f" />
          <stop offset="0.6" stopColor="#d8232a" />
          <stop offset="1" stopColor="#8f1018" />
        </radialGradient>
        <linearGradient id={id('pd-wood')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9a5b2a" />
          <stop offset="0.5" stopColor="#e0a464" />
          <stop offset="1" stopColor="#9a5b2a" />
        </linearGradient>
      </defs>
      {/* bois (tranche) */}
      <ellipse cx="100" cy="106" rx="94" ry="100" fill="#3a1d0b" />
      <ellipse cx="100" cy="104" rx="90" ry="96" fill={`url(#${id('pd-wood')})`} />
      {/* revêtement */}
      <ellipse cx="100" cy="102" rx="84" ry="90" fill={`url(#${id('pd-rubber')})`} />
      <path d="M44 62c14-22 34-32 58-34" stroke="#fff" strokeOpacity="0.4" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* manche */}
      <path d="M78 188h44l-6 34H84Z" fill={`url(#${id('pd-wood')})`} />
      <rect x="82" y="216" width="36" height="122" rx="14" fill={`url(#${id('pd-wood')})`} />
      <rect x="82" y="232" width="36" height="96" rx="10" fill="#0a1a4a" opacity="0.85" />
      <g stroke="#ffb81c" strokeWidth="3" opacity="0.9">
        <line x1="85" y1="248" x2="115" y2="240" />
        <line x1="85" y1="266" x2="115" y2="258" />
        <line x1="85" y1="284" x2="115" y2="276" />
        <line x1="85" y1="302" x2="115" y2="294" />
      </g>
    </svg>
  );
}

export function Shuttlecock({ className }) {
  const uid = useId().replace(/:/g, '');
  const id = (n) => `${n}-${uid}`;
  return (
    <svg className={className} viewBox="0 0 120 160" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id('sc-skirt')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9e3f5" />
        </linearGradient>
        <radialGradient id={id('sc-cork')} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d2e4" />
        </radialGradient>
      </defs>
      {/* jupe en plumes */}
      <path d="M8 10 Q60 -2 112 10 L76 116 H44 Z" fill={`url(#${id('sc-skirt')})`} stroke="#b8c4dc" strokeWidth="2" strokeLinejoin="round" />
      <g stroke="#a9b6d2" strokeWidth="2">
        <line x1="26" y1="8" x2="50" y2="114" />
        <line x1="45" y1="5" x2="56" y2="114" />
        <line x1="65" y1="4" x2="62" y2="114" />
        <line x1="84" y1="6" x2="68" y2="114" />
        <line x1="101" y1="9" x2="73" y2="114" />
      </g>
      <path d="M22 52 Q60 44 98 52" stroke="#2f7df6" strokeWidth="4" fill="none" />
      <path d="M34 86 Q60 80 86 86" stroke="#2f7df6" strokeWidth="4" fill="none" />
      {/* bouchon */}
      <rect x="42" y="110" width="36" height="12" rx="3" fill="#f26b1d" />
      <path d="M42 120 h36 v4 a18 18 0 0 1 -36 0 Z" fill={`url(#${id('sc-cork')})`} />
    </svg>
  );
}

export function Dumbbell({ className }) {
  const uid = useId().replace(/:/g, '');
  const id = (n) => `${n}-${uid}`;
  return (
    <svg className={className} viewBox="0 0 200 90" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id('db-plate')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f7df6" />
          <stop offset="1" stopColor="#0d2470" />
        </linearGradient>
        <linearGradient id={id('db-bar')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9eef8" />
          <stop offset="0.5" stopColor="#9aa7c2" />
          <stop offset="1" stopColor="#5b6783" />
        </linearGradient>
      </defs>
      <rect x="40" y="38" width="120" height="14" rx="5" fill={`url(#${id('db-bar')})`} />
      <rect x="6" y="30" width="14" height="30" rx="5" fill={`url(#${id('db-plate')})`} />
      <rect x="18" y="10" width="24" height="70" rx="8" fill={`url(#${id('db-plate')})`} />
      <rect x="158" y="10" width="24" height="70" rx="8" fill={`url(#${id('db-plate')})`} />
      <rect x="180" y="30" width="14" height="30" rx="5" fill={`url(#${id('db-plate')})`} />
      <rect x="22" y="16" width="5" height="58" rx="2.5" fill="#fff" opacity="0.35" />
      <rect x="162" y="16" width="5" height="58" rx="2.5" fill="#fff" opacity="0.35" />
      <rect x="84" y="36" width="32" height="18" rx="5" fill="#f26b1d" />
    </svg>
  );
}

export function Ball({ className }) {
  const id = `ball-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffd9a1" />
          <stop offset="0.55" stopColor="#ff9b2f" />
          <stop offset="1" stopColor="#d2600f" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id})`} />
      <ellipse cx="36" cy="32" rx="12" ry="8" fill="#fff" opacity="0.55" />
    </svg>
  );
}

/** Terrain de badminton vu en perspective, avec son filet. */
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
        <pattern id="court-net" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 0L12 12M12 0L0 12" stroke="#fff" strokeWidth="1" />
        </pattern>
      </defs>
      <polygon points="330,60 870,60 1180,420 20,420" fill="url(#court-floor)" />
      <g stroke="url(#court-fade)" strokeWidth="4" fill="none">
        <polygon points="330,60 870,60 1180,420 20,420" />
        {/* couloirs de double */}
        <line x1="360" y1="60" x2="80" y2="420" />
        <line x1="840" y1="60" x2="1120" y2="420" />
        {/* lignes de service */}
        <line x1="300" y1="96" x2="900" y2="96" />
        <line x1="268" y1="164" x2="932" y2="164" />
        <line x1="150" y1="270" x2="1050" y2="270" />
        <line x1="58" y1="384" x2="1142" y2="384" />
        <line x1="600" y1="60" x2="600" y2="164" />
        <line x1="600" y1="270" x2="600" y2="420" />
      </g>
      {/* filet */}
      <g>
        <line x1="190" y1="176" x2="1010" y2="176" stroke="#fff" strokeOpacity="0.9" strokeWidth="5" />
        <rect x="194" y="176" width="812" height="40" fill="url(#court-net)" opacity="0.5" />
        <line x1="190" y1="176" x2="190" y2="244" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" />
        <line x1="1010" y1="176" x2="1010" y2="244" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" />
      </g>
    </svg>
  );
}
