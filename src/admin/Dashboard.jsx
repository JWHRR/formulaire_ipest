import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpDown, CalendarCheck, CircleAlert, Download, ExternalLink, Filter, Hourglass, Inbox, Layers, LoaderCircle,
  LogOut, Phone, Printer, RefreshCw, Search, Trash2, Users, X,
} from 'lucide-react';
import { DEADLINE_ISO, EVENT, LOGO_SRC } from '../config.js';
import { useCountdown } from '../lib/useCountdown.js';
import { api } from './api.js';
import { SORTS, classKey, formatDateTime, formatTime, groupByClass, matchesSearch, toCsv, tunisDay } from './format.js';

const REFRESH_MS = 30000;

export default function Dashboard({ onExpired, onLogout }) {
  const [rows, setRows] = useState(null); // null = premier chargement
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const countdown = useCountdown(DEADLINE_ISO);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setRows(data.registrations.map((r, i) => ({ ...r, rank: i + 1 })));
      setUpdatedAt(new Date());
      setLoadError(null);
    } catch (err) {
      if (err.status === 401) return onExpired(err.message);
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onExpired]);

  // Chargement initial + actualisation automatique lorsque l'onglet est visible.
  useEffect(() => {
    load();
    const tick = () => document.visibilityState === 'visible' && load();
    const id = setInterval(tick, REFRESH_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const all = rows || [];
  const classes = useMemo(() => groupByClass(all), [all]);
  const today = tunisDay(new Date());
  const todayCount = all.filter((r) => tunisDay(r.createdAt) === today).length;

  const visible = useMemo(
    () =>
      all
        .filter((r) => (!classFilter || classKey(r.classe) === classFilter) && matchesSearch(r, search))
        .sort(SORTS[sort].fn),
    [all, classFilter, search, sort],
  );
  const filtered = Boolean(search || classFilter);
  const activeClassLabel = classes.find((c) => c.key === classFilter)?.label;

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscrits-dougga-testour-${today}${activeClassLabel ? `-${classKey(activeClassLabel)}` : ''}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const removed = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, rank: i + 1 })));
    setToast('Inscription supprimée.');
  };

  return (
    <>
      <header className="site-header admin-header">
        <div className="container site-header__inner">
          <a className="brand" href="/admin/">
            <img className="brand__logo" src={LOGO_SRC} alt="Logo IPEST" width="360" height="295" />
            <span className="brand__text">
              <strong>Espace organisateur</strong>
              <small>{EVENT.title}</small>
            </span>
          </a>
          <div className="admin-header__actions">
            <a className="btn btn--small btn--ghost hide-sm" href="/" target="_blank" rel="noopener">
              <ExternalLink size={16} aria-hidden="true" /> Voir le site
            </a>
            <button type="button" className="btn btn--small btn--ghost" onClick={onLogout}>
              <LogOut size={16} aria-hidden="true" /> <span className="hide-xs">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin container">
        <div className="admin__head">
          <div>
            <h1 className="admin__title">Inscriptions</h1>
            <p className="admin__sub">Sortie {EVENT.title} — {EVENT.dateLabel}</p>
          </div>
          <p className="admin__updated" aria-live="polite">
            {loading ? (
              <><LoaderCircle className="spin" size={14} aria-hidden="true" /> Actualisation…</>
            ) : updatedAt ? (
              <>Mis à jour à {formatTime(updatedAt)}</>
            ) : null}
          </p>
        </div>

        {loadError && (
          <div className="alert" role="alert">
            <CircleAlert size={20} aria-hidden="true" />
            <div>
              <strong>Impossible de charger les inscriptions.</strong>
              <p>{loadError}</p>
            </div>
            <button type="button" className="btn btn--small btn--ghost alert__action" onClick={load}>Réessayer</button>
          </div>
        )}

        {rows === null && !loadError ? (
          <div className="admin-loading admin-loading--inline" role="status">
            <LoaderCircle className="spin" size={26} aria-hidden="true" /> Chargement des inscriptions…
          </div>
        ) : rows !== null && (
          <>
            <section className="stats" aria-label="Chiffres clés">
              <Stat icon={Users} label="Inscrits" value={all.length} />
              <Stat icon={CalendarCheck} label="Aujourd’hui" value={todayCount} />
              <Stat icon={Layers} label="Classes" value={classes.length} />
              <Stat
                icon={Hourglass}
                label={countdown.closed ? 'Inscriptions' : 'Clôture dans'}
                value={countdown.closed ? 'Closes' : countdown.days > 0 ? `${countdown.days} j ${countdown.hours} h` : `${countdown.hours} h ${countdown.minutes} min`}
                tone={countdown.closed ? 'muted' : undefined}
              />
            </section>

            {classes.length > 0 && (
              <section className="card panel" aria-labelledby="by-class-title">
                <div className="panel__head">
                  <h2 id="by-class-title">Répartition par classe</h2>
                  <p>Touchez une classe pour filtrer la liste.</p>
                </div>
                <ul className="bars">
                  {classes.map((c) => {
                    const pct = Math.round((c.count / all.length) * 100);
                    const active = classFilter === c.key;
                    return (
                      <li key={c.key}>
                        <button
                          type="button" className={`bar ${active ? 'bar--active' : ''}`} aria-pressed={active}
                          onClick={() => setClassFilter(active ? '' : c.key)}
                          title={`${c.label} : ${c.count} inscrit${c.count > 1 ? 's' : ''} (${pct} %)`}
                        >
                          <span className="bar__label">{c.label}</span>
                          <span className="bar__track" aria-hidden="true">
                            <span className="bar__fill" style={{ width: `${(c.count / classes[0].count) * 100}%` }} />
                          </span>
                          <span className="bar__value">
                            {c.count} <small>{pct} %</small>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section className="card panel" aria-labelledby="list-title">
              <div className="panel__head panel__head--row">
                <h2 id="list-title">
                  Liste des inscrits <span className="count-pill">{filtered ? `${visible.length} / ${all.length}` : all.length}</span>
                </h2>
              </div>

              <div className="toolbar">
                <label className="toolbar__search">
                  <Search size={18} aria-hidden="true" />
                  <span className="sr-only">Rechercher</span>
                  <input
                    type="search" placeholder="Nom, prénom, téléphone, classe…" value={search}
                    onChange={(e) => setSearch(e.target.value)} enterKeyHint="search"
                  />
                </label>
                <label className="toolbar__select">
                  <Filter size={16} aria-hidden="true" />
                  <span className="sr-only">Filtrer par classe</span>
                  <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                    <option value="">Toutes les classes</option>
                    {classes.map((c) => <option key={c.key} value={c.key}>{c.label} ({c.count})</option>)}
                  </select>
                </label>
                <label className="toolbar__select">
                  <ArrowUpDown size={16} aria-hidden="true" />
                  <span className="sr-only">Trier</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                  </select>
                </label>
                <div className="toolbar__actions">
                  <button type="button" className="btn btn--small btn--ghost" onClick={load} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} aria-hidden="true" /> Actualiser
                  </button>
                  <button type="button" className="btn btn--small btn--ghost" onClick={exportCsv} disabled={!visible.length}>
                    <Download size={16} aria-hidden="true" /> Excel
                  </button>
                  <button type="button" className="btn btn--small btn--ghost" onClick={() => window.print()} disabled={!visible.length}>
                    <Printer size={16} aria-hidden="true" /> Imprimer
                  </button>
                </div>
              </div>

              {filtered && (
                <div className="active-filters">
                  {activeClassLabel && (
                    <button type="button" className="tag" onClick={() => setClassFilter('')}>
                      Classe : {activeClassLabel} <X size={14} aria-label="Retirer le filtre" />
                    </button>
                  )}
                  {search && (
                    <button type="button" className="tag" onClick={() => setSearch('')}>
                      « {search} » <X size={14} aria-label="Effacer la recherche" />
                    </button>
                  )}
                </div>
              )}

              {visible.length === 0 ? (
                <div className="empty">
                  <Inbox size={34} aria-hidden="true" />
                  <p>{all.length === 0 ? 'Aucune inscription pour le moment.' : 'Aucun inscrit ne correspond à votre recherche.'}</p>
                  {filtered && (
                    <button type="button" className="btn btn--small btn--ghost" onClick={() => { setSearch(''); setClassFilter(''); }}>
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">N°</th>
                          <th scope="col">Nom</th>
                          <th scope="col">Prénom</th>
                          <th scope="col">Téléphone</th>
                          <th scope="col">Classe</th>
                          <th scope="col">Inscription</th>
                          <th scope="col"><span className="sr-only">Actions</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((r) => (
                          <tr key={r.id}>
                            <td className="num">{r.rank}</td>
                            <td className="strong">{r.nom}</td>
                            <td>{r.prenom}</td>
                            <td><a className="phone" href={`tel:${r.telephone.replace(/\s/g, '')}`}>{r.telephone}</a></td>
                            <td><span className="class-tag">{r.classe}</span></td>
                            <td className="muted">{formatDateTime(r.createdAt)}</td>
                            <td className="actions">
                              <button type="button" className="icon-btn" onClick={() => setToDelete(r)} aria-label={`Supprimer l’inscription de ${r.prenom} ${r.nom}`}>
                                <Trash2 size={17} aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="cards">
                    {visible.map((r) => (
                      <li className="reg-card" key={r.id}>
                        <div className="reg-card__top">
                          <span className="reg-card__rank">#{r.rank}</span>
                          <div className="reg-card__name">
                            <strong>{r.nom}</strong> {r.prenom}
                          </div>
                          <button type="button" className="icon-btn" onClick={() => setToDelete(r)} aria-label={`Supprimer l’inscription de ${r.prenom} ${r.nom}`}>
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="reg-card__meta">
                          <span className="class-tag">{r.classe}</span>
                          <span className="muted">{formatDateTime(r.createdAt)}</span>
                        </div>
                        <a className="reg-card__call" href={`tel:${r.telephone.replace(/\s/g, '')}`}>
                          <Phone size={16} aria-hidden="true" /> {r.telephone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </>
        )}
      </main>

      <PrintSheet rows={[...visible].sort(SORTS.nom.fn)} classLabel={activeClassLabel} />
      <ConfirmDelete row={toDelete} onClose={() => setToDelete(null)} onDeleted={removed} onExpired={onExpired} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className={`stat card ${tone ? `stat--${tone}` : ''}`}>
      <span className="stat__icon" aria-hidden="true"><Icon size={18} /></span>
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
    </div>
  );
}

function ConfirmDelete({ row, onClose, onDeleted, onExpired }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (row && !dialog.open) {
      setError(null);
      dialog.showModal();
    } else if (!row && dialog.open) {
      dialog.close();
    }
  }, [row]);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.remove(row.id);
      onDeleted(row.id);
      onClose();
    } catch (err) {
      if (err.status === 401) {
        onClose();
        return onExpired(err.message);
      }
      if (err.status === 404) {
        onDeleted(row.id);
        return onClose();
      }
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog ref={ref} className="dialog" onClose={onClose} onCancel={(e) => busy && e.preventDefault()} aria-labelledby="dialog-title">
      {row && (
        <div className="dialog__body">
          <span className="dialog__icon" aria-hidden="true"><Trash2 size={24} /></span>
          <h2 id="dialog-title">Supprimer cette inscription ?</h2>
          <p>
            <strong>{row.prenom} {row.nom}</strong> — {row.classe}
            <br />
            {row.telephone}
          </p>
          <p className="muted">Cette action est définitive.</p>
          {error && <p className="field__error" role="alert"><CircleAlert size={15} aria-hidden="true" /> {error}</p>}
          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy} autoFocus>Annuler</button>
            <button type="button" className="btn btn--danger" onClick={confirm} disabled={busy}>
              {busy ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <Trash2 size={18} aria-hidden="true" />} Supprimer
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

/** Version imprimable : liste d'appel avec colonne « Présent ». */
function PrintSheet({ rows, classLabel }) {
  return (
    <section className="print-sheet" aria-hidden="true">
      <h1>Sortie {EVENT.title} — {EVENT.dateLabel}</h1>
      <p>
        {EVENT.organizer} · Liste des inscrits{classLabel ? ` — Classe ${classLabel}` : ''} · {rows.length} participant
        {rows.length > 1 ? 's' : ''} · Imprimé le {formatDateTime(new Date().toISOString())}
      </p>
      <table>
        <thead>
          <tr><th>N°</th><th>Nom</th><th>Prénom</th><th>Téléphone</th><th>Classe</th><th>Présent</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td><td>{r.nom}</td><td>{r.prenom}</td><td>{r.telephone}</td><td>{r.classe}</td><td className="box">☐</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
