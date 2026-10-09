import { Hourglass, Lock } from 'lucide-react';
import { DEADLINE_LABEL } from '../config.js';

const pad = (n) => String(n).padStart(2, '0');

export default function Countdown({ countdown, variant = 'light' }) {
  const { days, hours, minutes, seconds, closed } = countdown;

  if (closed) {
    return (
      <div className={`countdown countdown--${variant} countdown--closed`} role="status">
        <Lock size={18} aria-hidden="true" />
        <span>Les inscriptions sont closes depuis le {DEADLINE_LABEL.charAt(0).toLowerCase() + DEADLINE_LABEL.slice(1)}.</span>
      </div>
    );
  }

  const units = [
    { value: days, label: days > 1 ? 'Jours' : 'Jour' },
    { value: hours, label: 'Heures' },
    { value: minutes, label: 'Min' },
    { value: seconds, label: 'Sec' },
  ];

  return (
    <div className={`countdown countdown--${variant}`}>
      <p className="countdown__title">
        <Hourglass size={16} aria-hidden="true" />
        Clôture des inscriptions dans
      </p>
      <div className="countdown__grid" aria-hidden="true">
        {units.map((u) => (
          <div className="countdown__unit" key={u.label}>
            <span className="countdown__value">{pad(u.value)}</span>
            <span className="countdown__label">{u.label}</span>
          </div>
        ))}
      </div>
      <p className="sr-only">
        Il reste {days} jours, {hours} heures et {minutes} minutes avant la clôture des inscriptions.
      </p>
      <p className="countdown__deadline">{DEADLINE_LABEL}</p>
    </div>
  );
}
