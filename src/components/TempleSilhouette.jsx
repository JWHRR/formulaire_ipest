// Silhouette stylisée d'un temple romain (inspirée du Capitole de Dougga).
export default function TempleSilhouette({ className }) {
  const columns = [0, 1, 2, 3, 4, 5];
  return (
    <svg className={className} viewBox="0 0 600 260" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="templeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <g fill="url(#templeFill)">
        {/* fronton */}
        <path d="M150 78 300 18 450 78Z" />
        <rect x="140" y="78" width="320" height="16" rx="2" />
        <rect x="150" y="94" width="300" height="10" />
        {/* colonnes cannelées */}
        {columns.map((i) => {
          const x = 166 + i * 54;
          return (
            <g key={i}>
              <rect x={x - 4} y="104" width="30" height="8" rx="1" />
              <rect x={x} y="112" width="22" height="104" />
              <rect x={x - 4} y="216" width="30" height="8" rx="1" />
            </g>
          );
        })}
        {/* podium et marches */}
        <rect x="130" y="224" width="340" height="12" />
        <rect x="112" y="236" width="376" height="10" />
        <rect x="0" y="246" width="600" height="14" />
        {/* vestiges latéraux */}
        <rect x="40" y="180" width="18" height="66" />
        <rect x="70" y="200" width="18" height="46" />
        <rect x="520" y="170" width="18" height="76" />
        <rect x="548" y="206" width="18" height="40" />
        <rect x="34" y="174" width="30" height="7" />
        <rect x="514" y="164" width="30" height="7" />
      </g>
    </svg>
  );
}
