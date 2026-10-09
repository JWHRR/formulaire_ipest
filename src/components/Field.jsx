import { CircleAlert } from 'lucide-react';

/** Champ de formulaire accessible : libellé, indicateur obligatoire, aide et erreur liées. */
export default function Field({ id, label, required, hint, error, icon: Icon, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="field__req" aria-hidden="true"> *</span>
        ) : (
          <span className="field__opt"> (facultatif)</span>
        )}
      </label>
      <div className={`field__control ${Icon ? 'field__control--icon' : ''}`}>
        {Icon && <Icon className="field__icon" size={18} aria-hidden="true" />}
        {children({ 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, required })}
      </div>
      {hint && <p className="field__hint" id={hintId}>{hint}</p>}
      {error && (
        <p className="field__error" id={errorId}>
          <CircleAlert size={15} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
