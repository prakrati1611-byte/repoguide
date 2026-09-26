import type { OnboardingPackage } from '../lib/loader';

interface Props {
  pkg: OnboardingPackage;
  search: string;
}

function hl(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function matches(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export default function GapsSection({ pkg, search }: Props) {
  const filteredGaps = search
    ? pkg.knownGaps.filter(
        g => matches(g.area, search) || matches(g.gap, search)
      )
    : pkg.knownGaps;

  const filteredNotes = search
    ? pkg.notes.filter(n => matches(n, search))
    : pkg.notes;

  return (
    <>
      {/* Known Gaps */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">⚠️</span>
          <h2 className="section-title">Known Gaps</h2>
        </div>
        {filteredGaps.length === 0 ? (
          <p className="empty-state">No known gaps match "{search}".</p>
        ) : (
          filteredGaps.map((g, i) => (
            <div className="gap-item" key={i}>
              <div className="gap-area">{hl(g.area, search)}</div>
              <div className="gap-text">{hl(g.gap, search)}</div>
            </div>
          ))
        )}
      </div>

      {/* Notes */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">📝</span>
          <h2 className="section-title">Notes</h2>
        </div>
        {filteredNotes.length === 0 ? (
          <p className="empty-state">No notes match "{search}".</p>
        ) : (
          <div className="notes-list">
            {filteredNotes.map((note, i) => (
              <div className="note-item" key={i}>
                {hl(note, search)}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
